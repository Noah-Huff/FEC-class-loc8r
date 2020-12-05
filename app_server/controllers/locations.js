
/* get home page*/
const request = require('request');
const { response } = require('../../app');
const apiOptions = {
    server: 'http://localhost:3000' 
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://enigmatic-castle-68214.herokuapp.com';
}

const homelist = (req, res) => {
    const path = '/api/locations';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lng: -94.30972962942637, 
            lat: 38.91793387310823,
            maxDistance: 20000
        }
    };
    request(
        requestOptions,
        (err, {statusCode}, body) => {
            let data = [];
            if (statusCode === 200 && body.length) {
            data = body.map ( (item) => {
                item.distance = _formatDistance(item.distance);
                return item;
            });
        } 
        if (statusCode === 404) {
            data = null;
        }
            _renderHomepage(req, res, data);
    }
    );
};

/* get locations info page*/
const locationInfo = (req, res) => {
    const path = `/api/locations/${req.params.locationid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(
        requestOptions,
        (err, response, body) => {
            const data = body;
            console.log('THIS IS THE BODY', body);
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            _renderDetailPage(req, res, data);
        }
    );
};
/* get add review page*/
const addReview = (req, res) => {
    res.render('location-review-form', {
         title: 'Review Starcups on Loc8r',
        pageHeader: {title: 'Review Starcups' } 
    });
};

const _renderHomepage = (req, res, responseBody) => {
    let message = null;
    console.log('LAT', responseBody);
    if (!(responseBody instanceof Array)) {
        console.log('inside the if statement');
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No locations found near you.";
        }
    }
    res.render('locations-list', {
        title: "Loc8r - find a place to work with wifi",
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: responseBody,
        message

    });
};

const _formatDistance = (distance) => {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) {
        thisDistance = parseFloat(distance/1000).toFixed(1);
        unit = 'km';
    } else {
        thisDistance = Math.floor(distance);
    }
    return thisDistance + ' ' + unit;
};

const _renderDetailPage = (req, res, location) => {
    res.render('location-info', {
        title: location.name,
        pageHeader: {
            title: location.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down and get some work done.',
            callToAction: "If you've been and you like it - or if you don't - please leave a reviews."
        },
        location
    });
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};