var express = require('express');
var passport = require('passport');

var routes = function(User) {
    var authRoutes = express.Router();

    /*
    authRoutes.post('/signUp', passport.authenticate('local-signup', {
        successRedirect: '/#/start/profile', // redirect to the secure profile section
        failureRedirect: '/#/register', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    */
    authRoutes.post('/signUp', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info, $scope) {
        if (err) {
          return next(err);
        }
        if(!user) {
          return res.redirect('/#/login');
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          if (user.role === 'admin') {
            console.log('admin sam');
            return res.redirect('/#/admin/profile/'+user.username);
          } else {
            console.log('Nisam admin');
            $scope.userMozda = user;
              return res.redirect('/#/start/profile/'+user.username);
          }

        });
      })(req, res, next);
    });

    authRoutes.post('/signIn', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err);
        }
        if(!user) {
          return res.redirect('/#/login');
        }
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          if (user.role === 'admin') {
            return res.redirect('/#/admin/dashboard');
          } else {
              return res.redirect('/#/start/dashboard');
          }

        });
      })(req, res, next);
    });

    authRoutes.route('/profile')
        .all(function(req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function(req, res) {
            res.json(req.user);
        });
    authRoutes.route('/logout')
        .get(function(req, res) {

          console.log(' USAO OVDE');
          req.logout();
          return res.redirect('/#/login');

        });
    return authRoutes;
};

module.exports = routes;
