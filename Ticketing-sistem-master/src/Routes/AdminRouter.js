var express = require('express');

var routes = function() {
    var adminRouter = express.Router();

    adminRouter.route('/*')
        .get(function(req, res, next) {
          /*if(req.user) {
            if (req.user.role === 'admin') {
                console.log('admin');
            } else {
              res.redirect('/login');
            }

          } else {
            //res.redirect('/login');
            console.log('Loguj se');
            next();
          }
          */
        });

    return adminRouter;
};

module.exports = routes;
