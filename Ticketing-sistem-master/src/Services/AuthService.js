(function(angular) {
  var app = angular.module('app');

  app.service('AuthService', function($http, $resource) {
    var logged = false;
    var userLogged = {};
    this.isLogged = function() {
      return logged;
    };
    this.setLogged = function(log) {
      logged = log;
    };
    this.login = function(username, password) {
      var userData = {username:username,
      password:password};
      return $http({method:'POST', url:'/api/auth/signIn', data:userData});
    };
    this.logout = function() {
      return $http({method:'GET', url:'/api/auth/logout'});
    };
    this.register =  function(user) {
        console.log(user);
        var Auth = $resource('/api/auth/signUp');
        Auth.save();
    };
    this.setLoggedUser = function(user) {
      userLogged = user;
    };
    this.getLoggedUser = function() {
      return userLogged;
    };
  });
})(angular);
