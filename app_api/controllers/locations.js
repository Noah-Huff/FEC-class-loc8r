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
            //distance: `${doc.distance.calculated.toFixed()}m`
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
        limit: 10
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
             distanceField: "dist.calculated",
             maxDistance: 20000,
             spherical: true
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

    //remove here, to next comment for the book's code
    // Loc.geoNear(point, geoOptions, (err, results, stats) => {
    //     const locations = _buildLocationList(req, res, results, stats);
    //     console.log('Geo Results', results);
    //     console.log('Geo stats', stats);
    //     res
    //       .status(200)
    //       .json(locations);
          
          
    // try {
    //     const results = await Loc.aggregate([
    //         {
    //             $geoNear: {
    //                 near, 
    //                 ...geoOptions
    //             }
    //         }
    //     ]);
    //     const locations = results.map(result => {
    //         return {
    //             id: result._id,
    //             name: result.name,
    //             address: result.address,
    //             rating: result.rating,
    //             facilities: result.facilities,
    //             distance: `${result.distance.calculated.toFixed()}m`
    //         }
    //     });
    //     res
    //     .status(200)
    //     .json(locations);
    // } catch (err) {
    //     res
    //     .status(404)
    //     .json(err);
    //})
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

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne,
};