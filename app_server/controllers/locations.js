
/* get home page*/
const request = require('request');
const { response } = require('../../app');
const apiOptions = {
    server: 'http://localhost:3000' 
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://enigmatic-castle-68214.herokuapp.com';
}

const renderHomepage = (req, res, responseBody) => {
    res.render('locations-list', {
        title: "Loc8r - find a place to work with wifi",
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
        locations: responseBody

    });
};

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
        (err, response, body) => {
            renderHomepage(req, res, body);
    }
    );
};

/* get locations info page*/
const locationInfo = (req, res) => {
    res.render('location-info', {
        title: 'Location Info',
        pageHeader: { title: 'Starcups' },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3.5,
            facilities: ['Hot Drinks', 'Food', 'Premium Wifi'],
            coords: { lat: 51.455041, lng: -0.9690884 },
            //mapInfo: (typeof window === 'defined' && typeof(window.L) === 'defined') ? "No Map Available" : "yes", //document.getElementById("mapid").addEventListener("load", myFunction), 
            openingTimes: [{
                days: 'Monday-Friday',
                opening: "7:00am",
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Noah Huff',
                rating: 4.5,
                timestamp: 'November 11, 2020',
                reviewText: 'What a great place. I can\'t say enough good things about it.'
            }, {
                author: 'Charlie Chaplin',
                rating: 4.5,
                timestamp: 'November 11, 2020',
                reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
            }]
        }
    });
};
/* get add review page*/
const addReview = (req, res) => {
    res.render('location-review-form', {
         title: 'Review Starcups on Loc8r',
        pageHeader: {title: 'Review Starcups' } 
    });
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};