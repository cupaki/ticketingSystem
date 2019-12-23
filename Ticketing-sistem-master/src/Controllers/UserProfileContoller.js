(function(angular) {
    var userProfileContoller = function($scope, UsersData, $stateParams, $state) {
        $scope.user = {};
        $scope.user = UsersData.getUserByUsername($stateParams.username);

        $scope.showProject = function(projectId) {
            $state.go('dashboard.project', {
                id: projectId
            });
        };

    };
    var allUsersContoller = function($scope, UserSession, UsersData, $state) {
      $scope.showUserProfile = function(loggedUser, user) {
        if (loggedUser.role === 'admin') {
          $state.go('admin.UserProfile', {username:user.username});
        } else if (loggedUser.role === 'user') {
          $state.go('start.UserProfile', {username:user.username});
        }
      };
      if (UserSession.getUser().role === 'admin') {
        $scope.users = UsersData.getUsers();
      } else {
         $state.go('start.adminError');
      }

    };

    var userProfileSettingsContoller = function($scope, $stateParams, UserSession, UsersData) {
      //OVAJ TREBA DA MENJAM
      $scope.user = UserSession.getUser();

      $scope.updateUser = function(){

        console.log($scope.user.location + ' USER update');
          console.log($scope.user.education + ' USER update');
            console.log($scope.user.experience + ' USER update');
              console.log($scope.user.skills + ' USER update');
                console.log($scope.user.jobTitle + ' USER update');

          UsersData.updateUser($scope.user);

      };
    };

    var app = angular.module('app');

    app.controller('userProfileContoller', userProfileContoller)
       .controller('allUsersContoller', allUsersContoller)
       .controller('userProfileSettingsContoller', userProfileSettingsContoller);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('start.UserProfile', {
                url: '/profile/:username',
                templateUrl: 'templates/profile.html',
                controller: 'userProfileContoller',
            })
            .state('start.settings', {
                url: 'profile/settings/:username',
                templateUrl: 'templates/profileSettings.html',
                controller: 'userProfileSettingsContoller',
            })
            .state('admin.UserProfile', {
                url: '/profile/:username',
                templateUrl: 'templates/admin/profile.html',
                controller: 'userProfileContoller',
            })
            .state('admin.settings', {
                url: '/profile/settings/:username',
                templateUrl: 'templates/admin/profileSettings.html',
                controller: 'userProfileSettingsContoller',
            })
            .state('admin.allusers', {
                url: '/users',
                templateUrl: 'templates/admin/users.html',
                controller: 'allUsersContoller',
            });
    });
})(angular);
