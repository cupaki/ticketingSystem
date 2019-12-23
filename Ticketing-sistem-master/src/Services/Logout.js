(function(angular) {
  var app = angular.module('app');

  app.factory('Logout', function($http) {
    return {
      logOut : function() {
        return $http({method:'GET', url:'/api/auth/logout'});
      }
    };
  });
})(angular);
