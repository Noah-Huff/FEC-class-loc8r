const express = require('express');
const router = express.Router();
//const ctrlMain = require('../controllers/main'); // I don't think I need this.... not for sure yet though
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

// Locations Pages
router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);
//others page
router.get('/about', ctrlOthers.about);


/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

const homepageController = (req, res) => {
  res.render('index', { title: 'Express'});
};
/* GET home page*/
//router.get('/', ctrlMain.index);

module.exports = router;
