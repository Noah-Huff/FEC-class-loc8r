/* GET home page*/
const about = (req, res) => {
    res.render('generic-text', {
        title: 'About Loc8r',
    content: 'Loc8r was created to help people find places to sit down and get a bit of work done.<br /> <br />',
 });
};
module.exports = {
    about
};