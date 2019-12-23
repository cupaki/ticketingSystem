(function(angular) {
    var app = angular.module('app');

    app.factory('login', function($http) {
      return {
        loginUser: function(username, password) {
          var userData = {username:username,
          password:password};
          return $http({method:'POST', url:'/api/auth/signIn', data:userData});
        }
      };
    });
})(angular);
