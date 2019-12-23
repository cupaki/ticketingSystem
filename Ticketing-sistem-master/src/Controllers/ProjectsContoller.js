(function(angular) {

    var newProjectContoller = function($scope, $location, TeamData, ProjectData, $state) {
        $scope.teams = TeamData.getTeams();
        $scope.newProject = {};

        $scope.save = function() {
            ProjectData.insertProject($scope.newProject);

            $state.go('admin.projects', {
                username: 'all'
            });
        };

    };

    var projectsController = function($scope, $location, ProjectData, UsersData, $stateParams, $state) {
        var user = UsersData.getUserByUsername($stateParams.username);

        console.log('parametri su ' + $stateParams.username);
        if ($stateParams.username !== 'all') {
            user.$promise.then(function(result) {
                $scope.projects = result.projects; //da bi imali listu svih projekata iz baze u scope.proj
            });
        } else if ($stateParams.username === 'all') {
            $scope.projects = ProjectData.getProjects();
        }


        $scope.redirectToAssignment = function() {
            $location.url('/start');
        };
        $scope.projectDetails = function(project, user) {
            if (user.role === 'admin') {
                $state.go('admin.project', {
                    id: project._id
                });
            } else if (user.role === 'user') {
                $state.go('start.project', {
                    id: project._id
                });
            }
        };
        $scope.addNewAssignmentRedirect = function($scope, $stateParams) {
            $location.url('/register');
        };
        $scope.showProject = function(user) {
            if (user.role === 'admin') {
                $state.go('admin.projects', {
                    username: user.username
                });
            } else {
                $state.go('start.projects', {
                    username: user.username
                });
            }

        };
        $scope.showAllProjects = function() {
            $state.go('admin.projects', {
                username: 'all'
            });
        };

    };

    var displayProjectController = function($scope, ProjectData, $stateParams, TeamData) {
        var projectId = $stateParams.id;
        $scope.project = ProjectData.getProjectsById(projectId);

    };

    var projectInfoContoller = function($scope, ProjectData, $stateParams, $state) {
        var projectId = $stateParams.id;
        var project = ProjectData.getProjectsById(projectId);
        $scope.project = project;

        $scope.updateHide = true;

        $scope.updateHideFunction = function(){
          if ($scope.updateHide === false) {
              $scope.updateHide = true;
          } else {
              $scope.updateHide = false;
          }
        };


        $scope.saveChanges = function(){
          ProjectData.updateProject($scope.project);
          $scope.updateHide = true;
        };
        $scope.generateHistoryReport = function(projectId) {
          $state.go('admin.assignmentHistory', {id:projectId});
        };
        $scope.generateUsersActivityReport = function(projectId) {
          $state.go('admin.userActivity', {id:projectId});
        };


    };

    var app = angular.module('app')
        .controller('projectsController', projectsController)
        .controller('newProjectContoller', newProjectContoller)
        .controller('displayProjectController', displayProjectController)
        .controller('projectInfoContoller', projectInfoContoller);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.
        state('start.projects', {
                url: '/projects/:username',
                templateUrl: 'templates/projects.html',
                controller: 'projectsController'
            })
            .state('start.project', {
                url: '/project/:id',
                templateUrl: '/templates/project.html',
                controller: 'displayProjectController'
            })
            .state('admin.projects', {
                url: '/projects/:username',
                templateUrl: 'templates/admin/projects.html',
                controller: 'projectsController'
            })
            .state('admin.newProject', {
                url: '/newProject',
                templateUrl: 'templates/admin/newProject.html',
                controller: 'newProjectContoller'
            })
            .state('admin.project', {
                url: '/project/:id',
                templateUrl: '/templates/admin/project.html',
                controller: 'displayProjectController'
            });
    });
})(angular);
