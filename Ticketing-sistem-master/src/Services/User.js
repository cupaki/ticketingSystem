(function(angular) {
  var app = angular.module('app');

  app.factory('User', function($resource){
    return {
      getLoggedUser: function() {
          var User = $resource('/api/user/logged');
          var user = User.get();
          return user;
      }
    };
  });
})(angular);
