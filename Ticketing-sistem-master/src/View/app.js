(function(angular) {

    var app = angular.module('app', ['ui.router', 'ngResource', 'validation.match', 'chart.js']);

    app.constant('_',
        window._
    );

    app.run(['$rootScope', '$state', 'UsersData', 'AuthService', 'UserSession', function($rootScope, $state, UsersData, AuthService, UserSession) {
        $rootScope.$on('$stateChangeStart', function(e, to, toParams, from) {
            var state = to.name;
            UsersData.getLoggedUser(function(user) {
                UserSession.setUser(user);
                if (state === 'login' && user.username) { //ako pokusava da se loguje ako je vec logovan
                    if (user.role === 'admin') {
                        $state.go('admin.UserProfile', {
                            username: user.username
                        });
                    } else { //ako nije admin
                        $state.go('start.UserProfile', {
                            username: user.username
                        });
                    }
                } else if (state === 'register' && user.username) { //ako pokusava da se registruje a logovan je
                    if (user.role === 'admin') {
                        $state.go('admin.UserProfile', {
                            username: user.username
                        });
                    } else { //ako nije admin
                        $state.go('start.UserProfile', {
                            username: user.username
                        });
                    }
                } else if (to.data && to.data.needAdmin && user.role !== 'admin') { //ako pokusa da gadja admin delove
                    if (!user.username) { //pokusava admin delove a nije logovan
                        e.preventDefault();
                        $state.go('login');
                    } else {
                        e.preventDefault();
                        $state.go('start.adminError');
                    }

                } else if (state === 'login' && !user.username) {
                    $state.go('login');
                } else if (state === 'register' && !user.username) {
                    $state.go('register');
                } else if (to.data && to.data.user && user.role !== 'user') {
                    $state.go('admin.UserProfile', {
                        username: user.username
                    });
                }

            });


        });
    }]);

    app.filter('user', function(UsersData) {

        var data = null;
        var serviceInvoked = false;
        function userFilter(user) {
          return user;
        }
        filterStub.$stateful = true;
        function filterStub(input) {
            if (data===null) {
              if (!serviceInvoked) {
                serviceInvoked = true;
                UsersData.getUserByUsername(input, function(user) {
                  data = user.username;
                });
              }
              return '-';
            } else {
              return userFilter(data);
            }
        }

        return filterStub;

    });


})(angular);
