(function(angular) {

    var LatestProjectsController = function($scope, ProjectData) {
        var projects = ProjectData.getProjects();
        projects.$promise.then(function(response) {
            console.log(response);
            $scope.projects = response;
            console.log('Usao je u ovaj kontrol');
            /*for (var i = 1; i===4; i++) {
              console.log(response[response.length-i].title);
              $scope.projects.push(response[response.length-i]);
            }*/
        });

    };

    var filterTaskController = function($scope, UserSession) {
        $scope.taskPriorityOption = {};
        $scope.taskStatusOption = {};
        var assig = UserSession.getUser().assignments;
        $scope.assignments = assig;
        $scope.filter = function() {
            $scope.assignments = [];
            for (var i = 0; i < assig.length; i++) {
                if ($scope.taskPriorityOption && $scope.taskStatusOption) {
                    if ((assig[i].status === $scope.taskStatusOption) && (assig[i].priority === $scope.taskPriorityOption)) {
                        $scope.assignments.push(assig[i]);
                    }
                }
            }
        };
        $scope.clear= function() {
          $scope.assignments = assig;
        };
    };

    var app = angular.module('app');

    app.controller('LatestProjectsController', LatestProjectsController)
        .controller('filterTaskController', filterTaskController);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('start', {
                url: '/start',
                templateUrl: 'templates/dashboard.html',
                data: {
                    user: true
                }
            })
            .state('start.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboardMain.html'
            })
            .state('admin.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/admin/dashboardMain.html'
            })
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'templates/admin/dashboard.html',
                data: {
                    needAdmin: true
                }
            })
            .state('start.adminError', {
                templateUrl: 'templates/adminError.html'
            });
    });
})(angular);
