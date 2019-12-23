'use strict';
(function(angular) {

    var assignmentHistoryController = function($scope, $stateParams, ProjectData) {
        var project = ProjectData.getProjectsById($stateParams.id);
        var assignmentsType = {
            date: '',
            assignments: []
        };
        var listOfAssignments = {
            assignments: [assignmentsType]
        };
        var generateDoneDates = function(assignments) {
            var firstDate = $scope.assignmentsOnProject[0].updatedAt.substring(0, 10);
            var datesToShow = {
                dates: [{
                    date: firstDate,
                    count: 1,
                    assignment: []
                }]
            };
            datesToShow.dates[0].assignment.push(assignments[0]);
            for (var i = 1; i < assignments.length; i++) {
                if (!datesToShow.dates.length) { //ako je prazna
                    datesToShow.dates.push({
                        date: assignments[0].updatedAt.substring(0, 10),
                        count: 1
                    });
                } else { //ako postoji prolazimo kroz vec postojace
                    var dateToCompare = assignments[i].updatedAt.substring(0, 10);
                    var notFound = true;
                    for (var j = 0; j < datesToShow.dates.length; j++) { //proverava samo da li ga ima ili nema
                        if (datesToShow.dates[j].date === dateToCompare) { //vec postoji taj datum samo uvecaj kounter
                            notFound = false;
                            break;
                        }
                    }
                    if (notFound) { //ako ga nema
                        datesToShow.dates.push({
                            date: assignments[i].updatedAt.substring(0, 10),
                            count: 1,
                            assignment: [assignments[i]]
                        });

                    } else { //ako ga ima
                        for (var k = 0; k < datesToShow.dates.length; k++) {
                            if (datesToShow.dates[k].date === dateToCompare) {
                                datesToShow.dates[k].count++;
                                datesToShow.dates[k].assignment.push(assignments[i]);
                                break;
                            }
                        }
                    }
                }
            }
            $scope.doneDates = datesToShow;
        };
        project.$promise.then(function(result) {
            $scope.assignmentsOnProject = result.assignment;
            var firstDate = $scope.assignmentsOnProject[0].createdAt.substring(0, 10);
            var datesToShow = {
                dates: [{
                    date: firstDate,
                    count: 1,
                    assignment: []
                }]
            };
            datesToShow.dates[0].assignment.push(result.assignment[0]);
            for (var i = 1; i < result.assignment.length; i++) {
                if (!datesToShow.dates.length) { //ako je prazna
                    datesToShow.dates.push({
                        date: result.assignment[0].createdAt.substring(0, 10),
                        count: 1
                    });
                } else { //ako postoji prolazimo kroz vec postojace
                    var dateToCompare = result.assignment[i].createdAt.substring(0, 10);
                    var notFound = true;
                    for (var j = 0; j < datesToShow.dates.length; j++) { //proverava samo da li ga ima ili nema
                        if (datesToShow.dates[j].date === dateToCompare) { //vec postoji taj datum samo uvecaj kounter
                            notFound = false;
                            break;
                        }
                    }
                    if (notFound) { //ako ga nema
                        datesToShow.dates.push({
                            date: result.assignment[i].createdAt.substring(0, 10),
                            count: 1,
                            assignment: [result.assignment[i]]
                        });

                    } else { //ako ga ima
                        for (var k = 0; k < datesToShow.dates.length; k++) {
                            if (datesToShow.dates[k].date === dateToCompare) {
                                datesToShow.dates[k].count++;
                                datesToShow.dates[k].assignment.push(result.assignment[i]);
                                break;
                            }
                        }
                    }
                }
            }

            generateDoneDates(result.assignment);

            $scope.datesToShow = datesToShow;

        });

    };

    var doneAssigmentsOnProject = function($scope, $stateParams, AssigmentData, ProjectData, UsersData) {
        //za svakog korisnika na projektu kupi njegove assignmete na tom istom projektu
        var collectUserAssignmetOnProject = function(projectId) {
            var project = ProjectData.getProjectsById(projectId);
            project.$promise.then(function(result) {
                var usersOnProjectIDs = [];
                for (var i = 0; i < result.assignment.length; i++) { //prolazi kroz sve assignmente na projektu
                    for (var j = 0; j < result.assignment[i].users.length; j++) { //za svaki assigment kupi usere
                        if (!_.contains(usersOnProjectIDs, result.assignment[i].users[j])) {
                            usersOnProjectIDs.push(result.assignment[i].users[j]);
                        }

                    }
                }
                console.log('Useri na projektu');
                console.log(usersOnProjectIDs);
                var assignmetsByUser = [];
                for (var i = 0; i < result.assignment.length; i++) {
                    for (var j = 0; j < usersOnProjectIDs.length; j++) { //kroz sve usere na projektu
                        //izvlacimo sve assigmente za jednog usera na trenutnom projektu
                        if (_.contains(result.assignment[i].users, usersOnProjectIDs[j])) { //ako assigment sadrzi usera
                            if (!assignmetsByUser.length) {

                                assignmetsByUser.push({
                                    userID: usersOnProjectIDs[j],
                                    assignment: []
                                });
                                assignmetsByUser[assignmetsByUser.length - 1].assignment.push(result.assignment[i]);
                            } else {


                                for (var k = 0; k < assignmetsByUser.length; k++) {
                                    if (assignmetsByUser[k].userID === usersOnProjectIDs[j]) {
                                        assignmetsByUser[k].assignment.push(result.assignment[i]);
                                        break;
                                    } else {
                                        assignmetsByUser.push({
                                            userID: usersOnProjectIDs[j],
                                            assignment: []
                                        });
                                        assignmetsByUser[assignmetsByUser.length - 1].assignment.push(result.assignment[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }


                var users = UsersData.getUsers();
                users.$promise.then(function(result) {
                    for (var i = 0; i < assignmetsByUser.length; i++) {
                        for (var j = 0; j < result.length; j++) {
                            if (assignmetsByUser[i].userID === result[j]._id) {
                                assignmetsByUser[i].userID = result[j].username;
                            }
                        }
                    }

                    $scope.assignmetsByUser = assignmetsByUser;
                    console.log(assignmetsByUser);
                });

            });


        };
        collectUserAssignmetOnProject($stateParams.id);
    };

    var chartUserAssignmentController = function($scope, ProjectData, UsersData, $stateParams) {
        //za svakog korisnika na projektu kupi njegove assignmete na tom istom projektu
        var collectUserAssignmetOnProject = function(projectId) {

            var project = ProjectData.getProjectsById(projectId);

            project.$promise.then(function(result) {
              project = result;
                var usersOnProjectIDs = [];
                for (var i = 0; i < result.assignment.length; i++) { //prolazi kroz sve assignmente na projektu
                    for (var j = 0; j < result.assignment[i].users.length; j++) { //za svaki assigment kupi usere
                        if (!_.contains(usersOnProjectIDs, result.assignment[i].users[j])) {
                            usersOnProjectIDs.push(result.assignment[i].users[j]);
                        }

                    }
                }
                console.log('Useri na projektu');
                console.log(usersOnProjectIDs);
                var assignmetsByUser = [];
                for (var i = 0; i < result.assignment.length; i++) {
                    for (var j = 0; j < usersOnProjectIDs.length; j++) { //kroz sve usere na projektu
                        //izvlacimo sve assigmente za jednog usera na trenutnom projektu
                        if (_.contains(result.assignment[i].users, usersOnProjectIDs[j])) { //ako assigment sadrzi usera
                            if (!assignmetsByUser.length) {

                                assignmetsByUser.push({
                                    userID: usersOnProjectIDs[j],
                                    assignment: []
                                });
                                assignmetsByUser[assignmetsByUser.length - 1].assignment.push(result.assignment[i]);
                            } else {


                                for (var k = 0; k < assignmetsByUser.length; k++) {
                                    if (assignmetsByUser[k].userID === usersOnProjectIDs[j]) {
                                        assignmetsByUser[k].assignment.push(result.assignment[i]);
                                        break;
                                    } else {
                                        assignmetsByUser.push({
                                            userID: usersOnProjectIDs[j],
                                            assignment: []
                                        });
                                        assignmetsByUser[assignmetsByUser.length - 1].assignment.push(result.assignment[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }


                var users = UsersData.getUsers();
                users.$promise.then(function(result) {
                    for (var i = 0; i < assignmetsByUser.length; i++) {
                        for (var j = 0; j < result.length; j++) {
                            if (assignmetsByUser[i].userID === result[j]._id) {
                                assignmetsByUser[i].userID = result[j].username;

                            }
                        }
                    }
                    $scope.labels = [];
                    $scope.data = [];
                    $scope.data2 = [];
                    $scope.labels2 = [];
                    var project = ProjectData.getProjectsById(projectId);
                    var doneCount = 0;
                    project.$promise.then(function(resultProj) {
                      for (var i = 0; i < resultProj.assignment.length; i++) {
                          if (resultProj.assignment[i].status === 'Done') {
                              doneCount++;
                          }
                      }
                      $scope.series = ['Series A'];
                      for (var z = 0; z < assignmetsByUser.length; z++) {
                          $scope.labels.push(assignmetsByUser[z].userID);
                          $scope.labels2.push(assignmetsByUser[z].userID);
                          $scope.data.push(assignmetsByUser[z].assignment.length);
                          var doneCountForUser = 0;
                          for (var k = 0; k < assignmetsByUser[z].assignment.length; k++) {
                              if (assignmetsByUser[z].assignment[k].status === 'Done') {
                                  doneCountForUser++;
                              }
                          }
                          $scope.data2.push(doneCountForUser / doneCount * 100);


                      }

                    });




                });
            });
        };

        collectUserAssignmetOnProject($stateParams.id);
    };
    var app = angular.module('app');

    app.controller('assignmentHistoryController', assignmentHistoryController)
        .controller('doneAssigmentsOnProject', doneAssigmentsOnProject)
        .controller('chartUserAssignmentController', chartUserAssignmentController);

    app.config(function($stateProvider) {
        $stateProvider
            .state('admin.assignmentHistory', {
                url: '/assignmentHistory/:id',
                templateUrl: '/templates/admin/assignmentHistory.html',
                controller: 'assignmentHistoryController'
            })
            .state('admin.userActivity', {
                url: '/project/:id/userActivity',
                templateUrl: '/templates/admin/projectActivity.html',
                controller: 'doneAssigmentsOnProject'
            });
    });
})(angular);
