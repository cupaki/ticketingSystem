(function(angular) {

    var newTeamController = function($scope, $location, $window, UsersData, TeamData, $state, $resource) {

        $scope.users = UsersData.getUsers();
        $scope.newTeam = {};

        $scope.save = function() {
            TeamData.insertTeam($scope.newTeam, function() {
                $state.go('admin.teams');
                //
            });


        };
    };


    var teamsController = function($scope, TeamData, $resource, $location, $stateParams, UserSession, $state, $window) {
        var loadTeams = function() {
            TeamData.getTeams(function(data) {
                $scope.teams = data;
            });
        };

        loadTeams();

        $scope.addedTeamsForProject = {};

        $scope.hideTeams = true;
        $scope.hideInfo = true;

        $scope.removeTeam = function(team) {
            TeamData.removeTeam(team);
        };

        $scope.deleteTeamFromProject = function(team, project) {

            TeamData.removeTeamFromProject(team._id, project._id);

            var refresh = function() {
              console.log('OSvezanjanje');
                TeamData.getTeamById($stateParams.id, function(result) {
                  $scope.team = result;
                });
            };
            setTimeout(refresh, 350);
            /*
            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.team', {
                    id: team._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.teams', {
                    id: team._id
                });
            } else {
                $state.go('login');
            }*/
        };

        $scope.hideNewTeams = function() {
            console.log($stateParams.id + ' state params id u timu');
            if ($scope.hideTeams === false) {
                $scope.hideTeams = true;
            } else {
                TeamData.getTeamsNotOnProject($stateParams.id, function(result) {
                    $scope.teams = result;
                });
                $scope.hideTeams = false;
            }
        };
        $scope.saveNewTeamsOnProject = function() {
            $scope.hideTeams = true;
            console.log($scope.addedTeamsForProject.teams + ' timovi na projektu');
            TeamData.addTeamsOnProject($scope.addedTeamsForProject.teams, $stateParams.id);

            //$window.location.reload();

            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.project', {
                    id: $stateParams.id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.project', {
                    id: $stateParams.id
                });
            } else {
                $state.go('login');
            }




        };
        $scope.hideInfoAboutTeam = function(team) {
            //dobavljamo taj team sa svim podacima
            //     $scope.teamWithAllContents = TeamData.getTeamById(team._id);

            if ($scope.hideInfo === false) {
                $scope.hideInfo = true;
            } else {
                //dobavljamo taj team sa svim podacima
                $scope.teamWithAllContents = TeamData.getTeamById(team._id);
                $scope.hideInfo = false;
            }
        };

        $scope.removeTeam = function(team) {
            TeamData.removeTeam(team, function() {
                loadTeams();
            });
        };

        $scope.TeamDetails = function(team) {
            //        $location.path('start/team/' + team._id);

            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.team', {
                    id: team._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.teams', {
                    id: team._id
                });
            } else {
                $state.go('login');
            }


        };

    };

    var displayTeamController = function($scope, $window,TeamData, $stateParams, $location, UsersData, ProjectData, UserSession, $state) {
        var teamId = $stateParams.id;
        $scope.team = TeamData.getTeamById(teamId);

        $scope.addedUsersInTeam = {};
        $scope.addedProjectsInTeam = {};


        $scope.updateHide = true;
        $scope.newMemberHide = true;
        $scope.newProjectHide = true;

        $scope.updateHideFunction = function() {
            if ($scope.updateHide === false) {
                $scope.updateHide = true;
            } else {
                $scope.updateHide = false;
            }
        };

        $scope.saveChanges = function() {

            $scope.updateHide = true;

        };

        $scope.removeUser = function(team, userr) {

            console.log(team.name + ' ime tima');
            console.log(userr.username + ' ime user');

            TeamData.removeUserFromTeam(team, userr._id);
            TeamData.removeUserFromTeam2(team, userr._id);

            setTimeout(function() {
              TeamData.getTeamById(teamId, function(result) {
                  $scope.team = result;
              });
            }, 150);


        };

        //za prikaz za dodavanje novog clana u tim
        $scope.addMemberHideFunction = function() {
            if ($scope.newMemberHide === false) {
                $scope.newMemberHide = true;
            } else {
                UsersData.getUsersNotInTeam($stateParams.id, function(result) {
                    $scope.usersWhichAreNotInTeam = result;
                });
                $scope.newMemberHide = false;
            }
        };

        $scope.saveNewUsersInTeam = function() {


            TeamData.addUsersInTeam($scope.addedUsersInTeam.teams, $stateParams.id);
            //refresh za team
            var refresh = function() {
              console.log('OSvezanjanje');
                TeamData.getTeamById($stateParams.id, function(result) {
                  $scope.team = result;
                });
            };
            setTimeout(refresh, 150);


            $scope.newMemberHide = true;
            /*
            $state.go('start.team', {
                id: $stateParams.id
            });*/


        };

        $scope.addProjectHideFunction = function() {
            if ($scope.newProjectHide === false) {
                $scope.newProjectHide = true;
            } else {
                ProjectData.getProjectsNotInTeam($stateParams.id, function(result) {
                    $scope.projectWhichAreNotInTeam = result;
                });
                $scope.newProjectHide = false;
            }
        };

        $scope.saveNewProjectsInTeam = function() {

            $scope.newProjectHide = true;
            TeamData.addProjectsInTeam($scope.addedProjectsInTeam.projects, $stateParams.id);
            var refresh = function() {
              console.log('OSvezanjanje');
                TeamData.getTeamById($stateParams.id, function(result) {
                  $scope.team = result;
                });
            };
            setTimeout(refresh, 150);


        };

        $scope.removeProjectsInTeam = function() {


        };

    };

    var app = angular.module('app')
        .controller('newTeamController', newTeamController)
        .controller('teamsController', teamsController)
        .controller('displayTeamController', displayTeamController);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin.newteam', {
                url: '/newTeam',
                templateUrl: 'templates/admin/newTeam.html',
                controller: 'newTeamController'
            })
            .state('admin.teams', {
                url: '/teams',
                templateUrl: 'templates/admin/teams.html',
                controller: 'teamsController'
            })
            .state('admin.team', {
                url: '/team/:id',
                templateUrl: 'templates/admin/team.html',
                controller: 'teamsController'
            })
            .state('start.teams', {
                url: '/team/:id',
                templateUrl: 'templates/team.html',
                controller: 'displayTeamController'
            });
    });

})(angular);
