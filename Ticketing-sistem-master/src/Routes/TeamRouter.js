var express = require('express');

var routes = function(Team, User, Project) {
    var teamRouter = express.Router();

    teamRouter
        .get('/', function(req, res, next) {
            var team = {};
            if (req.query.name) {
                team = {
                    name: new RegExp(req.query.name, 'i')
                };
            }
            //*********************JAKO BITNOOOOOO
            //ne moze da imamo dva responsa, vec samo jedan, tako da ne mozemo
            //da odvajamo i pravimo 2 populate-a, jer bi onda morali da saljemo
            //dva resposna, a to ne radi onda. Zato je u novijim verzijama mongoosea
            //omoguceno da se npr. stave u jedan populate dve stvari koje referenciramo

            Team.find(team).populate('projects users').exec(function(err, data) { //*********************************
                if (err) {
                    next(err);
                } else {
                    res.send(data);
                }
            });

        })
        .get('/:id', function(req, res, next) {
            Team.findOne({
                '_id': req.params.id
            }, function(err, data) {
                if (err) {
                    next(err);
                }
            }).populate('projects users').exec(function(err, team) {
                res.json(team);
            });
        })
        .get('/noOnproject/:id', function(req, res, next) { //izvlaci sve korisnike na projektu
            console.log(req.params.id);
            Team.find({
                'projects': {
                    $ne: req.params.id
                }
            }, function(err, teams) {
                //    console.log(teams + ' teams!');
                res.json(teams);
            });
        })
        .post('/', function(req, res, next) {

            var newTeam = new Team({
                name: req.body.name,
                users: []
            });
            var pupulateUsers = function() {
                if (req.body.users.length) {

                    console.log(req.body.users.length + ' -length');
                    User.findOneAndUpdate({
                        username: req.body.users[req.body.users.length - 1]
                    }, {
                        $push: {
                            'teams': newTeam._id
                        }
                    }, function(err, user) {
                        console.log('*');
                        console.log(user + ' JUZER');
                        if (err) {
                            next(err);
                        }
                        Team.findByIdAndUpdate(newTeam._id, {
                            $push: {
                                'users': user._id
                            }
                        }, function(err, team) {
                            if (err) { //OVO SAM DODAO I POCEO JE DA VIDI team DOLE!
                                next(err);
                                console.log('GREKSA***');
                            } else {
                              console.log('Tim u koji sam dodao usera ');
                              console.log(team);
                                req.body.users.pop();
                                console.log(req.body.users.length + ' -posle popa');

                                pupulateUsers();
                            }
                        });
                    });
                }

            };
            var insertTeam = function() {
                Team.findOne({
                    name: req.body.name
                }, function(err, team) { //trazenje da li vec postoji tim
                    if (err) {
                        next(err);
                    }
                    if (!team) {
                        newTeam.save(function(err, team) {
                            if (err) {
                                next(err);
                            }
                        });
                        pupulateUsers();
                    } else {
                        console.log('postoji tim');
                    }
                });
            };
            insertTeam();


        })


    .post('/:id/:users', function(req, res, next) {
        var teamId = req.params.id;



        //KASTOVANJE IMENA Usera, POSTO IH POSMATRA KAO STRINGOVE, A NE KAO LISTU
        /*  var str = req.params.teams;
          var teams = str.split(',').map(function (val) { return +val + 1; });
          */
        var users = req.params.users.split(',');

        var funkcija = function() {

            Team.findOne({
                _id: teamId
            }, function(err, team) {

                var updateUser = function() {
                    if (users.length) {
                        User.findOneAndUpdate({
                                username: users[users.length - 1]

                            }, {
                                $push: {
                                    'teams': teamId
                                }
                            },
                            function(err, user) {
                                if (err) {
                                    next(err);
                                    console.log(err);
                                }

                                Team.findOneAndUpdate({
                                    _id: teamId
                                }, {
                                    $push: {
                                        'users': user._id
                                    }
                                }, function(eer, team) {
                                    if (err) {
                                        next(err);
                                    }

                                    for (var i = 0; i < team.projects.length; i++) {
                                        console.log(team.projects.length + ' lenght');
                                        console.log(team.projects[i] + ' projekat od ');
                                        console.log(user.username + ' user od ');
                                        User.findOneAndUpdate({
                                            username: user.username
                                        }, {
                                            $push: {
                                                'projects': team.projects[i]
                                            }
                                        }, function(err, userN) {
                                            console.log(userN + ' user izmenjen');
                                            if (err) {
                                                next(err);
                                            }
                                        });

                                    }


                                });
                            });


                        users.pop();
                        updateUser();
                    }
                };
                updateUser();
            });
        };

        funkcija();
    })

    .post('/:id/project/:projects', function(req, res, next) {
        var teamId = req.params.id;

        //KASTOVANJE IMENA Usera, POSTO IH POSMATRA KAO STRINGOVE, A NE KAO LISTU
        /*  var str = req.params.teams;
          var teams = str.split(',').map(function (val) { return +val + 1; });
          */
        var projects = req.params.projects.split(',');

        var funkcija = function() {

            Team.findOne({
                _id: teamId
            }, function(err, team) {

                var updateProjects = function() {
                    if (projects.length) {
                        Project.findOneAndUpdate({
                                title: projects[projects.length - 1]

                            }, {
                                $push: {
                                    'teams': teamId
                                }
                            },
                            function(err, proj) {
                                if (err) {
                                    next(err);
                                    console.log(err);
                                }

                                Team.findOneAndUpdate({
                                    _id: teamId
                                }, {
                                    $push: {
                                        'projects': proj._id
                                    }
                                }, function(eer, team) {
                                    if (err) {
                                        next(err);
                                    }

                                    for (var i = 0; i < team.users.length; i++) {

                                        User.findOneAndUpdate({
                                            _id: team.users[i]
                                        }, {
                                            $push: {
                                                'projects': proj._id
                                            }
                                        }, function(err, userN) {
                                            console.log(userN + ' user izmenjen');
                                            if (err) {
                                                next(err);
                                            }
                                        });

                                    }


                                });
                            });


                        projects.pop();
                        updateProjects();
                    }
                };
                updateProjects();
            });
        };

        funkcija();
    })

    .put('/:id', function(req, res, next) {
        Team.findOne({
            '_id': req.params.id
        }, function(err, team) {
            if (err) {
                next(err);
            }
            var newTeam = req.body;
            team.name = newTeam.name;
            team.save(function(err, data) {
                if (err) {
                    next(err);
                }
                res.json(data);
            });
        });
    })

    .put('/:id/:idUser', function(req, res, next) {

        //iz usera izbacujemo Project-e, jer kad se user izbrise iz teama, onda se brise i projekat na kom je radio u tom timu
        var teamId = req.params.id;
        var userId = req.params.idUser;

        Team.findOne({
            '_id': teamId
        }, function(err, team) {

            User.findOne({
                '_id': userId
            }, function(err, user) {

                //izbacujemo projekte
                for (var i = 0; i < user.projects.length; i++) {
                    for (var j = 0; j < team.projects.length; j++) {
                        if (user.projects[i].toString() === team.projects[j].toString()) {

                            user.projects.splice(i, 1);

                            //izbacujemo assignmente/////////// NE RADI, MORA KROZ KOLBEK DA SE POZOVE SAVE!////////////////
                            Project.findOne({
                                '_id': team.projects[j]
                            }, function(err, proj) {

                                for (var m = 0; m < user.assignments.length; m++) {
                                    for (var n = 0; n < proj.assignment.length; n++) {
                                        if (user.assignments[m].toString() === proj.assignment[n].toString()) {

                                            console.log(user.assignments[m] + ' * ' + m);
                                            user.assignments.splice(m, 1);
                                            console.log(' URADIO brisanje assignmenta!');
                                        }

                                    }
                                }

                                user.save(function(err, us) {
                                    console.log(' CUVAM');
                                    if (err) {
                                        next(err);
                                    }
                                });

                            });
                            //////////////////////////////////////////////////////////////////////////////////

                        }
                    }
                }


                //cuvanje svih izmena zajedno
                /*    user.save(function(err, us){
                      console.log(' CUVAM');
                      if(err){
                        next(err);
                      }
                    });*/
            });
        });




        /*      var projects = [] ;
          var teamFromProject;

          var izbaciTimove = function(){

          User.findOne({
                '_id': userId
            }, function(err, user){

              //dosli na projekata koje treba da obrisemo (i var projects)
              Project.find({}).populate('teams').exec(function(err, data){

                if(err){
                  next(err);
                }

                          Team.findOne({
                            '_id': teamId
                          }, function(err, team){

                            for(var c=0; c<data.length;c++){

                            teamFromProject = data[c].teams;

                                        for(var d=0;d<teamFromProject.length;d++){
                                          if(JSON.stringify(teamFromProject[d]) === JSON.stringify(team)){
                                            projects.push(data[c]);
                                          }
                                        }

                            }

                            var a1;
                            var a2;
                            for(var a=0; a<user.projects.length; a++){
                                for(var n=0; n<projects.length;n++){
                                  console.log(user.projects[a] + ' A');
                                  console.log(projects[n]._id + ' B');

                                  a1 = user.projects[a].toString();
                                  a2 = projects[n]._id.toString();

                                  if(a1 == a2){
                                    console.log('OVDEEE222');
                                    console.log(user.projects.length + ' len pre');
                                    console.log(a + ' a');

                                      user.projects.splice(a,1);
                                      console.log(user.projects.length + ' len posle');
                                      user.save();
                                  }
                                }
                            }

                                }
                              );

                        });

            }
          );
};


      izbaciTimove();

*/


    })





    .put('/:id2/user/:idUser2', function(req, res, next) {

        var teamId = req.params.id2;
        var userId = req.params.idUser2;


        //izbacujemo usera iz teama
        Team.findOne({
            '_id': teamId
        }, function(err, team) {
            var k;
            for (var i = 0; i < team.users.length; i++) {
                if (team.users[i] == userId) { //sve ok, treba da crveni
                    k = i;
                    team.users.splice(k, 1);
                    break;
                }
            }

            team.save();
        });


        //izbacujemo team iz usera
        User.findOne({
            '_id': userId
        }, function(err, user) {
            var m;
            for (var j = 0; j < user.teams.length; j++) {
                if (user.teams[j] == teamId) { //sve ok, treba da crveni
                    m = j;
                    user.teams.splice(m, 1);
                    break;
                }
            }
            user.save();
        });

        console.log('ZAVRSIO OVDE');

    })


    .delete('/:id', function(req, res, next) {
        console.log('USAO OVDE');
        Team.remove({
            '_id': req.params.id
        }, function(err, successIndicator) {
            if (err) {
                next(err);
            }
            res.json(successIndicator);
        });
    });
    return teamRouter;
};

module.exports = routes;
