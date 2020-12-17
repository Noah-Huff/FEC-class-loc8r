const mongoose = require('mongoose');
//const router = require('../routes');
const Loc = mongoose.model('Location');

const _buildLocationList = (req, res, results, stats) => {
    let locations = [];
    results.forEach((doc) => {
        locations.push({
            distance: `${doc.dist.calculated}`,
            name: doc.name,
            address: doc.address,
            rating: doc.rating,
            facilities: doc.facilities,
            _id: doc._id,
        });
    });
    return locations;
};

const locationsListByDistance = async (req, res) => { 
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        distanceField: "dist.calculated",
        key: 'coords',
        spherical: true,
        maxDistance: 20000, //distance is in meters
        //limit: 10
    };
    if (!lng || !lat) {
        console.log('locationsListByDistance missing params');
        res
        .status(404)
        .json({
            "message": "lng and lat paramaters are required"
        });
        return;
    } else {
    Loc.aggregate([
        {
          $geoNear: {
             near: point,
             key: 'coords',
             distanceField: "dist.calculated",
             maxDistance: 20000,
             spherical: true,
          }
        }
     ],//),
     function(err, results, stats) {
         if (err) {
             res
             .status(404)
             .json(err);
         } else {
             locations = _buildLocationList(req, res, results, stats);
             console.log('Geo results', results);
             console.log('Geo stats', stats);
             res
             .status(200)
             .json(locations);
             
         }
     }
     )
    };
};
const locationsReadOne = (req, res) => { 
    Loc
    .findById(req.params.locationid)
    .exec((err, location) => { 
        if (!location) {
            return res
            .status(404)
            .json({
                "message": "locationid not found"
            });
        } else if (err) {
            return res
            .status(404)
            .json(err);
        }
        res
        .status(200)
        .json(location);
        //_updateMapToCoffeeShopLocation(location.lng, location.lat);
    });
};

const locationsCreate = (req, res) => {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: {
            type: "Point",
            coordinates: [
                parseFloat(req.body.lng), 
                parseFloat(req.body.lat)
            ]
        },
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }],
    }, (err, location) => {
        if (err){
            res
            .status(400)
            .json(err);
        } else {
            res
            .status(201)
            .json(location);
        }
    });
};
const locationsUpdateOne = (req, res) => {
    if (!req.params.locationid) {
        return res
        .status(404)
        .json({
            "message": "Not found, locationid is required"
        });
    }
    Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((err, location) => {
        if (!location) {
            return res
            .json(404)
            .status({"message": "location not found"});
        } else if (err) {
            return res
            .status(400)
            .json(err);
        }
        location.name = req.body.name;
        location.address = req.body.address;
        location.facilities = req.body.facilities.split(',');
        location.coords = 
        {
            type: "Point",
            coordinates: [
                parseFloat(req.body.lng), 
                parseFloat(req.body.lat)
            ]
        };
        location.openingTimes = [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }];
        location.save((err,loc) => {
            if (err) {
                res
                .status(404)
                .json(err);
            } else {
                res
                .status(200)
                .json(loc);
            }
        });
    }
    );
};

const locationsDeleteOne = (req, res) => { 
    const {locationid} = req.params;
    if (locationid) {
        Loc
        .findByIdAndRemove(locationid)
        .exec((err, location) => {
            if (err) {
                return res
                .status(404)
                .json(err);
            }
            res
            .status(204)
            .json(null);
        });
    } else {
        res
        .status(404)
        .json({"message": "No Location"});
    }
};

const _updateMapToCoffeeShopLocation = (lng, lat) => {
    var mymap = L.map('mapid').setView([1.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaHVmZnN0ZXIiLCJhIjoiY2toZTZzeTd4MG03czMwbzIwN2xiNHgwaSJ9.4PrmZNzpL6Q1rZ49bCD9lA'
}).addTo(mymap);
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne,
};