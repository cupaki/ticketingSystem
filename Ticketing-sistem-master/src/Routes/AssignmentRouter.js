var express = require('express');

var routes = function(Assignment, User, Project, AssignmentVersion) {

    var assignmentRouter = express.Router();

    assignmentRouter
        .get('/', function(req, res, next) {
            var assignment = {};
            if (req.query.title) {
                assignment = {
                    title: new RegExp(req.query.title, 'i')
                };
            }
            Assignment.find(assignment).populate('users comments').exec(function(err, data) {
                if (err) {
                    next(err);
                }
                res.send(data);
            });
        })
        .get('/:id', function(req, res, next) {
            Assignment.findOne({
                '_id': req.params.id
            }).populate('users comments').exec(function(err, data) {
                if (err) {
                    next(err);
                }
                res.send(data);
            });
        })
        .get('/:id/comments', function(req, res, next) {
            console.log(req.params.id + ' req id');
            Assignment.findOne({
                '_id': req.params.id
            }).populate('users comments').exec(function(err, data) {
                if (err) {
                    next(err);
                }
                console.log(data + ' DATA');
                res.send(data);
            });
        })
        .get('/user/:username', function(req, res, next) {

        })
        .post('/project/:id', function(req, res, next) {
            var newAssignment = req.body;
            var that = this;
            console.log(that.users + ' THAT');
            that.users = req.body.users;

            for (var i = 0; i < that.users.length; i++) {
              console.log(that.users[i] + ' mesto' + ' ' + i);
            }

            newAssignment.users = [];
            var assignmentToSave = new Assignment(newAssignment);

            assignmentToSave.version = -2;

            var insertAssignmentUsers = function() {
                if (that.users) { //izbacio that.users.length (jer kad je undefinded, onda je problem)
                  if(that.users.length){
                    console.log('Ovde cu da pokusam da dodam assigment u usera');
                    User.findOneAndUpdate({
                            username: that.users[that.users.length - 1]
                        }, {
                            $push: {
                                'assignments': assignmentToSave._id
                            }
                        },
                        function(err, user) {
                          console.log(user + ' user koji je nadjem za UPDATE');
                            Assignment.findByIdAndUpdate(assignmentToSave._id, {
                                $push: {
                                    'users': user._id
                                }
                            }, function(err, assign) {
                              console.log(assign + ' assign za UPDATE');
                                if (err) {
                                    next(err);
                                    console.log('GREKSA***');
                                } else {
                                    that.users.pop();
                                    insertAssignmentUsers();
                                }
                            });
                        });
                    }
                }
            };
            var insertAssignment = function() {
                Assignment.findOne({
                    label: req.body.label
                }, function(err, assign) { //trazenje da li vec postoji title taj
                    if (err) {
                        next(err);
                    }
                    if (!assign) {
                        assignmentToSave.save(function(err, assign) {
                            if (err) {
                                next(err);
                                console.log(err);
                            }
                            insertAssignmentUsers();
                        });
                    } else {
                        console.log('postoji assign');
                    }
                });
            };

            Project.findOneAndUpdate({
                    _id: req.query.id
                }, {
                    $push: {
                        'assignment': assignmentToSave._id
                    }
                },
                function(err, project) {
                    if (err) {
                        next(err);
                    }
                    //insertAssignment();
                });
            insertAssignment();



        })
        .post('/', function(req, res, next) {


            var newAssignment = new Assignment({
                title: req.body.title,
                label: req.body.label,
                description: req.body.description,
                priority: req.body.priority,
                status: req.body.status,
                users: [],
                version: 1
            });


            var insertAssignment = function() {
                Assignment.findOne({
                    title: req.body.title
                }, function(err, assign) { //trazenje da li vec postoji title taj
                    if (err) {
                        next(err);
                    }
                    if (!assign) {
                        newAssignment.save(function(err, assign) {
                            if (err) {
                                next(err);
                            }
                        });
                    } else {
                        console.log('postoji assign');
                    }
                });
            };

            var pupulateUsers = function() {
                if (req.body.users.length) {

                    User.findOne({
                            username: req.body.users[req.body.users.length - 1]
                        },
                        function(err, user) {
                            Assignment.findByIdAndUpdate(newAssignment._id, {
                                $push: {
                                    'users': user._id
                                }
                            }, function(err, assign) {
                                if (err) { //OVO SAM DODAO I POCEO JE DA VIDI team DOLE!
                                    next(err);
                                    console.log('GREKSA***');
                                } else {
                                    //    res.json(team);
                                    req.body.users.pop();
                                    pupulateUsers();
                                }
                            });
                        });
                }
            };
            insertAssignment();
            pupulateUsers();

        })
        .put('/:id', function(req, res, next) {

            Assignment.findOne({
                '_id': req.params.id
            }, function(err, assignment) {
                if (err) {
                    next(err);
                }

                var newAssignmentVersion = {
                        'version': 0,
                        originalAssignment: req.body._id,
                    };




                var newAssVersionModel = new AssignmentVersion(newAssignmentVersion);

                newAssVersionModel.save(function(err, data) {
                    if (err) {
                        console.log(err);
                    }

                    console.log('Sacuvani verz');
                    console.log(data);
                });
                AssignmentVersion.findOneAndUpdate({
                    originalAssignment: assignment._id
                }, {
                    $push: {
                        assignment: assignment
                    }
                }, function(err, assignmentVer) {

                    if (err) {
                        next(err);
                    }


                });

                var newAssignment = req.body;
                assignment.title = newAssignment.title;
                assignment.label = newAssignment.label;
                assignment.description = newAssignment.description;
                assignment.priority = newAssignment.priority;
                assignment.status = newAssignment.status;
                assignment.save(function(err, data) {
                    if (err) {
                        next(err);
                    }
                    res.json(data);
                });
            });
        })
        .delete('/:id/:id2', function(req, res, next) {

          console.log(' usao u ruter');

            var assignmentId = req.params.id;
            var projectId = req.params.id2;


            //brisem iz usera assignment
            Assignment.findOne({
                '_id': assignmentId
            }, function(err, assign) {
                if (err) {
                    next(err);
                }


                for (var i = 0; i < assign.users.length; i++) {
                  User.findOne({
                      '_id': assign.users[i]
                  }, function(err, user) {
                      if (err) {
                          next(err);
                      }

                      for (var j = 0; j < user.assignments.length; j++) {
                        console.log(assign._id + ' === ' + user.assignments[j]);
                          if(assign._id.toString() === user.assignments[j].toString()){
                            user.assignments.splice(j,1);

                          }
                      }
                      user.save();



                      //brisem assignment
                      Assignment.remove({
                          '_id': assignmentId
                      }, function(err, successIndicator) {
                          if (err) {
                              next(err);
                          }


                      });

                  });
                }

            });


        });

    return assignmentRouter;

};

module.exports = routes;
