(function(angular) {
  var loginContoller = function($scope,$state, login, $location, AuthService) {
    $scope.username = '';
    $scope.password = '';
    $scope.login = function() {

      AuthService.login($scope.username, $scope.password)
        .then(function(res) {
          //UserService.setUser(res.data);
          AuthService.setLogged(true);
          AuthService.setLoggedUser(res.data);
          if (res.status===200) {
            if (res.data.role === 'admin') {
              $state.go('admin.UserProfile', {username:res.config.data.username});

            } else {
              $state.go('start.UserProfile', {username:res.config.data.username});

            }

          } else {
            //$location.url('/login');
          }
        }, function(res) {

        });

    };
  };

  var app = angular.module('app')
  .controller('loginContoller', loginContoller);

  app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginContoller'
    });
  });
})(angular);
