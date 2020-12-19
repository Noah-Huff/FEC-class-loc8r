
/* get home page*/
const request = require('request');
const { response, render } = require('../../app');
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
            maxDistance: 20
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
            console.log('Homelist Data = ', data);
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
        (err, {statusCode}, body) => {
            let data = body;
            console.log('THIS IS THE BODY', body);
            if (statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            _renderDetailPage(req, res, data);
        } else {
            _showError(req, res, statusCode);
        }
        }
    );
};
/* get add review page*/
const addReview = (req, res) => {
    getLocationInfo(req, res,
        (req, res, responseData) => _renderReviewForm(req, res, responseData)
    );
};

const doAddReview = (req, res) => {
    const locationid = req.params.locationid;
    const path = `/api/locations/${locationid}/reviews`;
    const postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postdata
    };
    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect(`/location/${locationid}/review/new?err=val`);
    } else {
    request(
        requestOptions,
        (err, {statusCode}, {name}) => {
            if (statusCode === 201) {
                res.redirect(`/location/${locationid}`);
            } else if (statusCode === 400) {
                console.log('INSIDE THE ELSE IF STATEMENT');
                res.redirect(`/location/${locationid}/review/new?err=val`);
            } else {
                _showError(req, res, statusCode);
            }
        }
    );
    }
};

const getLocationInfo = (req, res, callback) => {
    const path = `/api/locations/${req.params.locationid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(
        requestOptions,
        (err, {statusCode}, body) => {
            let data = body;
            console.log('THIS IS THE BODY', body);
            if (statusCode === 200) {
            data.coords = {
                lng: body.coords[0],
                lat: body.coords[1]
            };
            console.log('THESE ARE FROM _GETLOCATIONINFO', body.coords.lat);
            callback(req, res, data);
        } else {
            _showError(req, res, statusCode);
        }
        }
    );
};

//PRIVATE METHODS
const _renderHomepage = (req, res, responseBody) => {
    let message = null;
    if (!(responseBody instanceof Array)) {
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

const _showError = (req, res, status) => {
    let title = '';
    let content = '';
    if (status === 404) {
        title = '404, page not found';
        content = 'Uh oh, looks like this page can\'t be found.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something has gone wrong somewhere.';
    }
    res.status(status);
    res.render('generic-text', {
        title, 
        content
    });
};

const _renderReviewForm = (req, res, {name}) => {
    res.render('location-review-form', {
        title: `Review ${name} on Loc8r`,
        pageHeader: { title: `Review ${name}`},
        error: req.query.err
    });
};


// //code for DO ADD REVIEW Method
// if (!postdata.author || !postdata.rating || !postdata.reviewText) {
//     res.redirect(`/location/${locationid}/review/new?err=val`);
//   } else {

module.exports = {
    homelist,
    locationInfo,
    addReview,
    doAddReview,
    getLocationInfo
};