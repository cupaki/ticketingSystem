var express = require('express');

var routes = function(AssignmentVersion) {
  var assignmentRouter = express.Router();

  assignmentRouter
    .get('/:id', function(req, res, next) {   //vraca sve verzije assignmenta za odredjeni id
      AssignmentVersion.find({'originalAssignment': req.params.id}, function(err, data) {
        if (err) {
          console.log(err);
          next(err);
        }
        res.json(data);
      });
    });

    return assignmentRouter;
};

module.exports = routes;
