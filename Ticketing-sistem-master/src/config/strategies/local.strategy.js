var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require(__base + 'src/Models/User');

module.exports = function() {
    passport.use(new LocalStrategy({
        usernameField: 'username', //name of the username and password field in views
        passwordField: 'password'
    }, function(username, password, done) {
        User.findOne({
            'username': username
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {message: 'Incorrect username'});
          }

          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        });
    }));
};
