var express = require('express');

var routes = function(User) {
    var userRouter = express.Router();

    userRouter
    //api/user/username  || api/user/
        .get('/', function(req, res, next) {
            var user = {};
            console.log(req.query.username);
            if (req.query.username) {
                user = {
                    username: new RegExp(req.query.username, 'i')
                };

                User.findOne(user, function(err, data) {
                    if (err) {
                        next(err);
                    }
                }).populate('teams projects').exec(function(err, data) {
                    res.json(data);
                });
            } else {
                User.find(user, function(err, data) {
                    if (err) {
                        next(err);
                    }
                }).populate('teams projects').exec(function(err, data) {
                    res.json(data);
                });
            }
        })
        .get('/logged', function(req, res, next) {
          if(req.user) {
            User.findOne({username:req.user.username}, function(err, user) {

            }).populate('assignments projects').exec(function(err, user) {
              res.json(user);
            });
          } else {
            res.json(404);
          }
        })
        .get('/project/:id', function(req, res, next) {   //izvlaci sve korisnike na projektu
          console.log(req.params.id);
          User.find({'projects':req.params.id}, function(err, users) {
            res.json(users);
          });
        })
        .get('/:id', function(req, res, next) {
            User.findOne({
                '_id': req.params.id
            }, function(err, data) {
                if (err) {
                    next(err);
                }

            }).populate('teams assignments projects').exec(function(err, user) {
                res.json(user);
            });
        })
        .get('/notInTeam/:id', function(req, res, next) {   //izvlaci sve korisnike na projektu

          User.find({'teams': {$ne:req.params.id}}, function(err, users) {
        //    console.log(teams + ' teams!');
            res.json(users);
          });
        })
        .post('/', function(req, res, next) {
            var user = new User(req.body);
            user.save(function(err, data) {
                if (err) {
                    next(err);
                }
                res.json(data);
            });
        })
        .put('/:id', function(req, res, next) {
            User.findOne({
                '_id': req.params.id
            }, function(err, user) {
                if (err) {
                    next(err);
                }

                //nastavljam redovno
                var newUser = req.body;

                //brisem prethodnu listu i popunjavam je opet, ako je doslo do promene polja skills
                if(JSON.stringify(newUser.skills) ===  JSON.stringify(user.skills)){
                  console.log(' isti su i nema promene');
                }
                else {
                  user.skills = [];
                  user.save();

                  var skills = newUser.skills.split(',');
                  for (var i = 0; i < skills.length; i++) {
                      user.skills.push(skills[i]);
                  }
                }

                user.email = newUser.email;
                user.firstname = newUser.firstname;
                user.lastname = newUser.lastname;
                user.experience = newUser.experience;
                user.jobTitle = newUser.jobTitle;
                user.location = newUser.location;
                user.education = newUser.education;

                user.save(function(err, data) {
                    if (err) {
                        next(err);
                    }
                    res.json(data);
                });
            });
        })
        .delete('/:id', function(req, res, next) {
            User.remove({
                '_id': req.params.id
            }, function(err, successIndicator) {
                if (err) {
                    next(err);
                }
                res.json(successIndicator);
            });
        });

    return userRouter;
};

module.exports = routes;
