(function(angular) {

    var newCommentController = function($scope, $stateParams, CommentData, AssigmentData, $location, UsersData, UserSession, $state, $window) {

        $scope.commentHide = true;

        $scope.newComment = {};
        $scope.comments = CommentData.getComments($stateParams.id);

        $scope.saveComment = function(assignmentId) {
            UsersData.getLoggedUser(function(user) {
                $scope.user = user;

                $scope.newComment.author = $scope.user.username;
                CommentData.addComment($scope.newComment, assignmentId);


                //refresh
                $scope.comments = CommentData.getComments(assignmentId);
                $scope.commentHide = true;

    //              $window.location.reload();
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

            });


        };

        $scope.newCommentHide = function() {
            if ($scope.commentHide === false) {
                $scope.commentHide = true;
            } else {

                $scope.commentHide = false;
            }
        };


    };


    var displayAllCommentsController = function($scope, $state, AssigmentData, $stateParams, $location, UserSession) {
        var assignmentId = $stateParams.id;
        $scope.assignmentWithComments = AssigmentData.getAssignmentById(assignmentId);

        $scope.viewAllComments = function(assignmentId) {

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


        $scope.viewUserComments = function(assignmentId) {

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

    var deleteCommentController = function($scope, AssigmentData, $stateParams, $location, CommentData) {

        $scope.deleteComment = function(comment) {
            CommentData.removeComment(comment);
        };

    };

    var updateCommentController = function($scope, AssigmentData, $stateParams, $location, CommentData) {

      $scope.updateCommentHide = true;

      $scope.updateCommentFunction = function() {
        console.log( ' radi update!');
          if ($scope.updateCommentHide === false) {
              $scope.updateCommentHide = true;
          } else {
              $scope.updateCommentHide = false;
          }
      };


        $scope.saveUpdatedComment = function(comment) {

          CommentData.updateComment(comment);
          $scope.updateCommentHide = true;

        };

    };



    var app = angular.module('app').controller('newCommentController', newCommentController)
        .controller('displayAllCommentsController', displayAllCommentsController)
        .controller('deleteCommentController', deleteCommentController)
        .controller('updateCommentController', updateCommentController);

    app.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('start.comment', {
                url: '/assignment/:id/comments',
                templateUrl: '/templates/comments.html',
                controller: 'displayAllCommentsController'
            })
            .state('admin.comment', {
                url: '/assignment/:id/comments',
                templateUrl: '/templates/admin/comments.html',
                controller: 'displayAllCommentsController'
            })
          ;

    });



})(angular);
