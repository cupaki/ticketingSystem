(function(angular) {
  var logoutController = function($scope, Logout, $location) {
      $scope.logout = function() {
        Logout.logOut()
          .then(function(response) {
            if (response.status === 200) {
              $location.url('/login');
            }
          }, function(response) {

          });
      };
  };

  var app = angular.module('app')
  .controller('logoutController', logoutController);

})(angular);
