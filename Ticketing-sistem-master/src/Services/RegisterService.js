(function(angular) {
  var app = angular.module('app');

  app.factory('registerUser', function($http){
    return {
      registerUser: function(user) {
          console.log(user);
          return $http({method:'POST', url:'/api/auth/singUp', data:user});
      }
    };
  });
})(angular);
