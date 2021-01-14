const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
//require('../models/users');//I ADDED THIS LINE. I'M NOT SURE WHY THIS WORKDS NOW.
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
},
(username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, {
                message: 'Incorrect Username.'
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect Password.'
            });
        }
        return done(null, user);
    });
}
));