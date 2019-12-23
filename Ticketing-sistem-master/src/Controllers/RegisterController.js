(function(angular) {

    var registerController = function($scope, registerUser, $log, $location, AuthService) {
        var defaultRole = 'user';
        $scope.user = {role:defaultRole};
        $scope.samePassword = true;


        //save user to database
        $scope.save = function() {
            AuthService.register($scope.user);
                /*.then(function(res) {
                  if(res.status === 200) {
                    $location.url('/login');
                  }
                }, function() {
                  $location.url('/register');
                });*/
        };

    };

    var app = angular.module('app');
    app.controller('registerController', registerController);

    app.config(function($stateProvider, $urlRouterProvider) {
        //$urlRouterProvider.otherwise('/');
        $stateProvider
            .state('register', { //naziv stanja!
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'registerController'

            });
    });


})(angular);
