var express = require('express');

var routes = function(Project, Team, User, Assignment) {
    var projectRouter = express.Router();

    projectRouter
        .get('/', function(req, res, next) {
            var project = {};
            if (req.query.title) {
                project = {
                    title: new RegExp(req.query.title, 'i')
                };
            }
            Project.find(project).populate('teams assignment').exec(function(err,data){
              if(err){
                next(err);
              }
                res.send(data);

            });
        })
        .get('/:id', function(req, res, next) {

            Project.findOne({
                '_id': req.params.id
            }, function(err, data) {
                if (err) {
                    next(err);
                }

            }).populate('teams assignment').exec(function(err, data) {
              if (err) {
                next(err);
              }
              res.json(data);
            });
        })
        .get('/:id/assignments', function(req, res, next) {
            Project.findOne({
              '_id':req.params.id
            }, function(err, project) {

            }).populate('assignment').exec(function(err, project2) {
              console.log(' BIO OVDE');
              res.json(project2);
            });
        })
        .get('/notInTeam/:id', function(req, res, next) {   //izvlaci sve korisnike na projektu

          Project.find({'teams': {$ne:req.params.id}}, function(err, users) {
        //    console.log(teams + ' teams!');
            res.json(users);
          });
        })
        .post('/:id/assign', function(req, res, next){

          Project.findOne({
            '_id':req.params.id
          }, function(err, data) {
            if (err) {
              next(err);
            }
            res.json(data);
          });
        })
        .post('/', function(req, res, next) {

            var newProjectJson = {
                title: req.body.title,
                description: req.body.description,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                lable: req.body.lable,
                category: req.body.category,
                client: req.body.client
            };
            var newProject = new Project(newProjectJson);


            //ubacivanje projekta u bazu
            var insertProject = function() {
                newProject.save(function(err, project) {
                    if (err) {
                        next(err);
                        console.log(err);
                    }

                });
            };
            insertProject();

            //popunjava polje kod usera na kom projektu radi
            var populateUsersProjects = function(teamName, projectId) {

                Team.findOne({
                    name: teamName
                }, function(err, team) {
                    var teamMemebers = team.users;
                    console.log(teamMemebers + ' ---Member');
                    var updateUser = function() {
                        if (teamMemebers.length) {
                            User.findOneAndUpdate({ //*********** problem bio sto je je pisalo username, a ne _id, jer teamMembers sadrzi listu ideva
                                    _id: teamMemebers[teamMemebers.length - 1]

                                }, {
                                    $push: {
                                        'projects': projectId
                                    }
                                },
                                function(err, user) {
                                    if (err) {
                                        next(err);
                                        console.log(err);
                                    }
                                    console.log('Korisnk koji je azuriran ' + user);  //ovde se zaglupi ne zna ko je user, tj user je null
                                    teamMemebers.pop();
                                    updateUser();
                                });

                        }
                    };
                    res.send(team);
                    updateUser();
                });
            };
            //popunjavanje polja teams u projektu
            // i azururanje tima na kom projektu radi
            var populateProjectTeams = function() {
                if (req.body.teams.length) {
                    //Trazimo tim iz liste u bazi
                    console.log('Trazim tim u bazi ' + req.body.teams[req.body.teams.length - 1]);
                    Team.findOneAndUpdate({
                        name: req.body.teams[req.body.teams.length - 1]
                    }, {
                        $push: {
                            'projects': newProject._id
                        }
                    }, function(err, team) {
                        if (err) {
                            next(err);
                        }
                        if (team) {
                            //Azuriranje projekta
                            Project.findOneAndUpdate({
                                _id: newProject._id
                            }, {
                                $push: {
                                    'teams': team._id
                                }
                            }, function(err, project) {
                                if (err) {
                                    next(err);
                                }
                                req.body.teams.pop();
                                populateProjectTeams();
                            });
                            //Azuriranje korisnika i njihovih projekata u
                            //skladu sa kojim su timom
                            populateUsersProjects(team.name, newProject._id);
                        }
                    });
                }
            };

            //insertProject();
            populateProjectTeams();


        })
        .put('/:id', function(req, res, next) {

          console.log(req.params.id + ' ID put');
            Project.findOne({
                '_id': req.params.id
            }, function(err, project) {
                if (err) {
                    next(err);
                }
                var newProject = req.body;
                project.description = newProject.description;
                project.save(function(err, data) {
                    if (err) {
                        next(err);
                    }
                    res.json(data);
                });
            });

        })
        .post('/:id/:teams', function(req, res, next) {
            console.log(req.params.id + ' ID');
            console.log(req.params.teams + ' teams');
            var projectId = req.params.id;



//KASTOVANJE IMENA TIMOVA, POSTO IH POSMATRA KAO STRINGOVE, A NE KAO LISTU
          /*  var str = req.params.teams;
            var teams = str.split(',').map(function (val) { return +val + 1; });
            */
            var teams = req.params.teams.split(',');

            var funkcija = function(){

                Project.findOne({
                    _id: projectId
                }, function(err, project) {

                    var updateTeam = function() {
                        if (teams.length) {
                            Team.findOneAndUpdate({
                                    name: teams[teams.length - 1]

                                }, {
                                    $push: {
                                        'projects': projectId
                                    }
                                },
                                    function(err, team) {
                                        if (err) {
                                            next(err);
                                            console.log(err);
                                        }

                                        //dodavanje projekata svakom od membera
                                        for(var i=0; i<team.users.length;i++){
                                          User.findOneAndUpdate({
                                                  _id: team.users[i]
                                              }, {
                                                  $push: {
                                                      'projects': projectId
                                                  }
                                              }, function(err, userN){
                                                console.log(userN + ' user izmenjen');
                                                if(err){
                                                  next(err);
                                                }
                                              });
                                        }
                                        //

                                          Project.findOneAndUpdate({
                                            _id:projectId
                                          }, {
                                            $push : {
                                              'teams' : team._id
                                            }
                                          },function(eer, proj){
                                            if(err){
                                              next(err);
                                            }
                                          });
                                        });


                                    teams.pop();
                                    updateTeam();
                                }
                              };
                                updateTeam();
                            });
                          };

                    funkcija();

          })


        .delete('/:id', function(req, res, next) {
            Project.remove({
                '_id': req.params.id
            }, function(err, successIndicator) {
                if (err) {
                    next(err);
                }
                res.json(successIndicator);
            });
        })

        .delete('/:idProject/team/:idTeam', function(req, res, next) {


            var idProject = req.params.idProject;
            var idTeam = req.params.idTeam;

            //izbacivanje projekata iz usera (koji se nalaze u tom timu)
            var populateUsersProjects = function() {

              Team.findOne({
                   _id: idTeam
               }, function(err, team) {
                   var teamMemebers = team.users;

                   var updateUser = function() {
                       for (var i = 0; i < teamMemebers.length; i++) {
                         User.findOne({
                             '_id': teamMemebers[i]
                         }, function(err, user) {
                           console.log(user + ' useri nadjeni');
                             if (err) {
                                 next(err);
                             }

                             for (var j = 0; j < user.projects.length; j++) {
                               console.log(idProject + ' === ' + user.projects[j]);
                                 if(idProject.toString() === user.projects[j].toString()){
                                   console.log(' USAO USAO USAO');
                                   user.projects.splice(j,1);

                                 }
                             }
                             user.save();
                           });
                       }
                   };
           //        res.send(team);
                   updateUser();
               });
           };

              /*  Team.findOne({
                    _id: idTeam
                }, function(err, team) {
                    var teamMemebers = team.users;
                    var updateUser = function() {
                        if (teamMemebers.length) {
                            User.findOneAndUpdate({ //*********** problem bio sto je je pisalo username, a ne _id, jer teamMembers sadrzi listu ideva
                                    _id: teamMemebers[teamMemebers.length - 1]

                                }, {
                                    $pop: {
                                        'projects': idProject
                                    }
                                },
                                function(err, user) {
                                    if (err) {
                                        next(err);
                                        console.log(err);
                                    }
                                    teamMemebers.pop();
                                    updateUser();
                                });
                        }
                    };
            //        res.send(team);
                    updateUser();
                });
            };*/


            //IZBACIVANJE TIMA IZ PROJEKTA
            Project.findOne({
                _id:idProject
              }, function(err, project){
                if(err){
                  next(err);
                }

                for (var i = 0; i < project.teams.length; i++) {
                  if(project.teams[i].toString() === idTeam.toString()){
                      project.teams.splice(i,1);
                      console.log(' Obrisao tim iz projekta');
                  }
                }
                project.save();
              }

              );
          /*  Project.findOneAndUpdate({_id:idProject},
              {
                $pop :{'teams': idTeam}
              },
              function(err, project) {
                if (err) {
                  next(err);
                }
            });*/

            //IZBACIVANJE PROJEKTA IZ TIMA
            Team.findOne({
                _id:idTeam
              }, function(err, team){
                if(err){
                  next(err);
                }

                for (var i = 0; i < team.projects.length; i++) {
                  if(team.projects[i].toString() === idProject.toString()){
                      team.projects.splice(i,1);
                      console.log(' Obrisao projekat iz teama');
                  }
                }
                team.save();

                populateUsersProjects();
              }

              );

        /*    Team.findOneAndUpdate({_id:idTeam},
              {
                $pop :{'projects': idProject}
              },
              function(err, team) {
                if (err) {
                  next(err);
                }
          //      deleteInTeamProject();
              populateUsersProjects();
            });*/

      });


    return projectRouter;
};

module.exports = routes;
