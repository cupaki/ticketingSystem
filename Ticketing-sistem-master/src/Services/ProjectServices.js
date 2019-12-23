(function(angular) {
  var app = angular.module('app');

  app.factory('ProjectData', function($resource, UsersData) {
    return {
      getProjects: function() {
        var Project = $resource('/api/project');
        var projects = Project.query();
        return projects;
      },
      getProjectsById: function(projectId) {
        //'/user/:userId', {userId:'@id'}
        var Project = $resource('/api/project/:id', {id:'@id'});
        var that = this;
        var project = Project.get({id:projectId});
        return project;

      },
      insertProject: function(newProject) {
        var Project = $resource('/api/project/');
        var project = new Project(newProject);
        project.$save();
      },
      getProjectResource: function() {

      },
      getUsesOnProject : function(projectId, callback) {
        var User = $resource('/api/user/project/:id', {id:projectId});
        var users = User.query();
        users.$promise.then(function(result) {
          callback(result);
        });
      },

      updateProject : function(projectForUpdate){
        var Project = $resource('/api/project/:id',
          {id:'@_id'},
          {update:{method:'PUT'}});

          var project = new Project(projectForUpdate);
          console.log(project.title + ' assign posle Assign');

          project.$update();

      },
      getProjectsNotInTeam : function(teamId, callback){
        var Project = $resource('/api/project/notInTeam/:id', {id:teamId});
        var project = Project.query();
        project.$promise.then(function(result) {
          callback(result);
        });




      }
    };
  });
})(angular);
