(function(angular) {
  var app = angular.module('app');

  var mainContoller = function($scope, UsersData, $state, Logout) {
    $scope.user = {};
    UsersData.getLoggedUser(function(user) {
      $scope.user = user;
    });
    $scope.showDashboard = function(user) {
      if (user.role === 'admin') {
        $state.go('admin.dashboard');
      } else if (user.role === 'user') {
        $state.go('start.dashboard');
      }
    };
    $scope.showAssignmentsForUser = function(user) {
      if (user.role === 'admin') {
        $state.go('start.assignments', {username:user.username});
      } else if (user.role === 'user') {
        $state.go('admin.assignments', {username:user.username});
      }
    };
    $scope.showAssignmentsForUser = function(user) {
      if(user.role === 'admin') {
        $state.go('admin.assignments', {
            username: user.username
        });
      } else if (user.role === 'user') {
        $state.go('start.assignments', {
            username: user.username
        });
      }
    };
    $scope.showAllTasks = function(user) {
      if (user.role === 'admin') {
        $state.go('admin.assignmentsAll', {
            username: 'all'
        });
      } else {
        $state.go('start.adminError');
      }
    };
    $scope.showAllUsers = function() {
      $state.go('admin.allusers');
    };
    $scope.settings = function(user) {
      if (user.role === 'admin') {
        $state.go('admin.settings', {username:user.username});
      } else if (user.role === 'user') {
        $state.go('start.settings', {username:user.username});
      }
    };
    $scope.showAllTeams = function(user) {
      if (user.role === 'admin') {
        $state.go('admin.teams');
      } else {
        $state.go('start.adminError');
      }
    };
    $scope.showUserProfile = function(user) {
      console.log('Pokrecem ovbo');
      if(user.role === 'admin') {
        $state.go('admin.UserProfile', {username:user.username});
      } else if (user.role === 'user') {
        $state.go('start.UserProfile', {username:user.username});
      } else {
        $state.go('login');
      }
    };

    $scope.logOut = function() {
        var logout = Logout.logOut();
        logout.then(function(result){
            if(result.status === 200){
              $state.go('login');
            }
        });


    };
  };

  app.controller('mainContoller', mainContoller);
})(angular);
