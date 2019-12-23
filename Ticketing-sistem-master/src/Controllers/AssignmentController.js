(function(angular) {


    var newAssignmentController = function($scope, $resource, $location, AssigmentData, $stateParams, ProjectData, UserSession, $state, UsersData) {
        $scope.assignments = {};
        //AssigmentData is custom defined service
        AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
            $scope.assignments = result.assignment;

        });

        $scope.newAssignment = {
            done: false,
        };

        $scope.hiddeNewAssignment = true;
        var refreshTasks = function() {
            $scope.assignments = AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
                $scope.assignments = result.assignment;
            });
        };
        $scope.saveAssign = function() {
            UsersData.getLoggedUser(function(user) {
                //dodela usernamea na assignment
                $scope.user = user;

                $scope.newAssignment.userCreated = $scope.user.username;
                var project = $scope.project;

                //formiranje LABEL-a od projekta i rednog broja
                var labelAssignment = project.lable + '-' + (project.assignment.length + 1);
                $scope.newAssignment.label = labelAssignment;

                var useriNaAssign = $scope.newAssignment.users;

                $scope.newAssignment.userCreated = $scope.user.username;
                $scope.hiddeNewAssignment = true;

                AssigmentData.insertAssignmentToProject($stateParams.id, $scope.newAssignment, refreshTasks);
                refreshTasks();


                //ponovo preuzimanje assignmenta iz baze i redirekcija
                AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
                    $scope.assignments = result.assignment;
                });

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

            });
        };

        $scope.redirectToTask = function() {
            $location.url('/');
        };
        $scope.newAssignmentHidde = function() {
            if ($scope.hiddeNewAssignment === false) {
                $scope.hiddeNewAssignment = true;
            } else {
                ProjectData.getUsesOnProject($stateParams.id, function(result) {
                    $scope.users = result;
                });
                $scope.hiddeNewAssignment = false;
            }
        };

        $scope.AssignmentDetails = function(assignment) {
            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.assignment', {
                    id: assignment._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.assignment', {
                    id: assignment._id
                });
            } else {
                $state.go('login');
            }
        };

        $scope.removeAssignment = function(assignment, project) {

            var refresh = function() {
                console.log('pozvan je freres');
                AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
                    $scope.assignments = result.assignment;
                });
            };
            AssigmentData.removeAssignment(assignment, project);



            setTimeout(refresh, 300);

            /*
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
            */
        };


    };


    var userAssignmetController = function($scope, $state) {

    };
    var assignmentActionsController = function($scope, $state) {
        $scope.showAssignmentsForUser = function(username) {
            $state.go('start.assignments', {
                username: username
            });
        };
    };


    var displayAssignmentController = function($scope, AssigmentData, $stateParams, $location, $state, UserSession) {
        //AssigmentData is custom defined service
        AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
            $scope.assignments = result.assignments;
        });
        var loadHistory = function() {
            console.log('Pozvalo se osvezavanje istorije');
            AssigmentData.getAssignmentHistory($stateParams.id, function(result) {

                $scope.assignmentHistory = result[0];

            });
        };
        $scope.AssignmentDetails = function(assignment) {


            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.assignment', {
                    id: assignment._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.assignment', {
                    id: assignment._id
                });
            } else {
                $state.go('login');
            }
        };

        $scope.removeAssignment = function(assignment, project) {
            console.log(' OVDE cont');
            AssigmentData.removeAssignment(assignment, project);

        };


        var assignmentId = $stateParams.id;
        $scope.quantity = 2;
        $scope.assignment = AssigmentData.getAssignmentById(assignmentId);

        /*  AssigmentData.getCommentsFromAssignment(assignmentId, function(comments){
          console.log(comments + ' [[][][][]]');
          $scope.comments = comments;
        });
*/
        $scope.updateHide = true;

        $scope.updateHideFunction = function() {
            if ($scope.updateHide === false) {
                $scope.updateHide = true;
            } else {
                $scope.updateHide = false;
            }
        };

        $scope.saveChanges = function() {
            console.log($scope.assignment.priority + ' prioriter');
            console.log($scope.assignment.status + ' status');

            AssigmentData.updateAssignment($scope.assignment, loadHistory);
            $scope.updateHide = true;

            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.assignment', {
                    id: $scope.assignment._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.assignment', {
                    id: $scope.assignment._id
                });
            } else {
                $state.go('login');
            }

        };

    };
    var displayAssignmentForUserController = function($scope, $stateParams, UserSession, AssigmentData, $state, $location) {
        var loadHistory = function() {
            console.log('Pozvalo se osvezavanje istorije');
            AssigmentData.getAssignmentHistory($stateParams.id, function(result) {

                $scope.assignmentHistory = result[0];

            });
        };
        $scope.AssignmentDetails = function(assignment) {

            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.assignment', {
                    id: assignment._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.assignment', {
                    id: assignment._id
                });
            } else {
                $state.go('login');
            }
        };
        loadHistory();

        var assignmentId = $stateParams.id;
        $scope.quantity = 2;
        $scope.assignment = AssigmentData.getAssignmentById(assignmentId);

        $scope.updateHide = true;
        $scope.viewAllComments = function(assignmentId) {
            console.log('ovaj');
            if (UserSession.getUser().role === 'admin') {

                $state.go('admin.comment', {
                    id: assignmentId
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.comment', {
                    id: assignmentId
                });
            } else {
                $state.go('login');
            }

        };
        $scope.saveChanges = function() {
            console.log($scope.assignment.priority + ' prioriter');
            console.log($scope.assignment.status + ' status');


            AssigmentData.updateAssignment($scope.assignment, loadHistory);
            $scope.updateHide = true;


        };
        $scope.updateHideFunction = function() {
            if ($scope.updateHide === false) {
                $scope.updateHide = true;
            } else {
                $scope.updateHide = false;
            }
        };
        $scope.removeAssignment = function(assignment, project) {
            AssigmentData.removeAssignment(assignment, project);
        };
        if ($stateParams.username !== 'all') {
            var user = UserSession.getUser();
            $scope.assignments = user.assignments;
        } else if ($stateParams.username === 'all') {
            $scope.assignments = AssigmentData.getAssignments();
        }
    };
    var displayAssignmentDetailsController = function($scope, AssigmentData, $stateParams, UserSession, $state) {
        //AssigmentData is custom defined service
        AssigmentData.getAssigmentsOfProject($stateParams.id, function(result) {
            $scope.assignments = result.assignments;
        });
        var loadHistory = function() {
            AssigmentData.getAssignmentHistory($stateParams.id, function(result) {

                $scope.assignmentHistory = result[0];

            });
        };
        $scope.AssignmentDetails = function(assignment) {
            if (UserSession.getUser().role === 'admin') {
                $state.go('admin.assignment', {
                    id: assignment._id
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.assignment', {
                    id: assignment._id
                });
            } else {
                $state.go('login');
            }
        };

        $scope.removeAssignment = function(assignment, project) {
            AssigmentData.removeAssignment(assignment, project);
        };
        var assignmentId = $stateParams.id;
        $scope.quantity = 2;
        $scope.assignment = AssigmentData.getAssignmentById(assignmentId);

        $scope.updateHide = true;

        $scope.updateHideFunction = function() {
            if ($scope.updateHide === false) {
                $scope.updateHide = true;
            } else {
                $scope.updateHide = false;
            }
        };

        $scope.saveChanges = function() {

            AssigmentData.updateAssignment($scope.assignment, loadHistory);
            $scope.updateHide = true;


        };
        $scope.assignment = AssigmentData.getAssignmentById($stateParams.id);
        loadHistory();
        $scope.viewAllComments = function(assignmentId) {
            console.log('ovaj');
            if (UserSession.getUser().role === 'admin') {

                $state.go('admin.comment', {
                    id: assignmentId
                });
            } else if (UserSession.getUser().role === 'user') {
                $state.go('start.comment', {
                    id: assignmentId
                });
            } else {
                $state.go('login');
            }

        };

    };

    var app = angular.module('app')
        .controller('newAssignmentController', newAssignmentController)
        .controller('displayAssignmentController', displayAssignmentController)
        .controller('displayAssignmentForUserController', displayAssignmentForUserController)
        .controller('displayAssignmentDetailsController', displayAssignmentDetailsController);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.
        state('start.assignment', {
                url: '/assignment/:id',
                templateUrl: '/templates/assignment.html',
                controller: 'displayAssignmentDetailsController'
            })
            .state('start.assignments', { //prikaz svih assigmenta za jednog usera
                url: '/assignments/:username',
                templateUrl: '/templates/assignments.html',
                controller: 'displayAssignmentForUserController'
            })
            .state('admin.assignment', {
                url: '/assignment/:id',
                templateUrl: '/templates/admin/assignment.html',
                controller: 'displayAssignmentDetailsController'
            })
            .state('admin.assignments', { //prikaz svih assigmenta za jednog usera
                url: '/assignments/:username',
                templateUrl: '/templates/admin/assignments.html',
                controller: 'displayAssignmentForUserController'
            })
            .state('admin.assignmentsAll', { //prikaz svih assigmenta za jednog usera
                url: '/assignments/:username',
                templateUrl: '/templates/admin/assignments.html',
                controller: 'displayAssignmentForUserController'
            });


    });

})(angular);
