(function(angular) {
  var app = angular.module('app');

  app.factory('UsersData', function($resource, $log) {
    return {
      getUsers : function() {
          var User = $resource('/api/user/');
          var users = User.query();
          return users;
      },
      getLoggedUser: function(callback) {
          var User = $resource('/api/user/logged');
          var user = User.get();
          user.$promise.then(function(result) {
            callback(user);

          });

      },
      getUserByUsername: function(username, callback) {
        var User = $resource('/api/:verb', {verb:'user', username:username});
        var user = User.get();
        return user;
      },
      getUserById: function(userId, callback) {
        var User = $resource('/api/user/:id', {id:userId});
        var user = User.get();
        user.$promise.then(function(result) {
          callback(user);
        });
        //return user;
      },

      getUsersNotInTeam : function(teamId, callback){
        var User = $resource('/api/user/notInTeam/:id', {id:teamId});
        var users = User.query();
        users.$promise.then(function(result) {
          callback(result);
        });
      },

      updateUser : function(userForUpdate, callback){

        var User = $resource('/api/user/:id',
          {id:'@_id'},
          {update:{method:'PUT'}});

          var user = new User(userForUpdate);

          console.log(user + ' user');
          user.$update(callback);

      }
    };
  });

  app.service('UserSession', function(){
    var userOnSystem = {};
    this.setUser = function(user) {
      userOnSystem = user;
    };
    this.getUser = function() {
      return userOnSystem;
    };
  });
})(angular);
