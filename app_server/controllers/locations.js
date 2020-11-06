/* get home page*/
const homelist = (req, res) => {
    res.render('locations-list', { title: 'Home is where the heart is'});
};
/* get locations info page*/
const locationInfo = (req, res) => {
    res.render('index', { title: 'Location Info'});
};
/* get add review page*/
const addReview = (req, res) => {
    res.render('index', { title: 'Add Review'});
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};