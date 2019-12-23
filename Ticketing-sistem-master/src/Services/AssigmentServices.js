(function(angular) {
    var app = angular.module('app');

    app.factory('AssigmentData', function($resource) {
      return {
        getAssignments : function() {
          var Assignment = $resource('/api/assignment');
          var assignments = Assignment.query();
          return assignments;
        },
        getAssigmentsResource : function() {
          return $resource('/api/assignment');
        },
        insertAssignment : function(assignment) {
          var Assignment = $resource('/api/assignment');
          var newAssignment = new Assignment(assignment);
          newAssignment.$save();
        },
        insertAssignmentToProject : function(projectId, assignment, refreshTasks) {
          var Assignment = $resource('/api/assignment/project/id', {
            id:'@id'
          });
          console.log(Assignment);
          var newAssignment = new Assignment(assignment);
          newAssignment.$save({id:projectId}, function(){
            refreshTasks();
          })
            .then(function(response) {

            }).finally(function(){
              refreshTasks();
            });
        },
        getAssigmentsOfProject: function(projectId, callback) {

        var Project = $resource('/api/project/:id/assignments', {id:'@id'});
        var assigments = Project.get({id: projectId});

          assigments.$promise.then(function(result) {
            callback(result);
          });
        },
        removeAssignment: function(assignment, project, callback) {
          var Assignment = $resource('/api/assignment/:id/:id2', {id:'@id', id2:project._id});
          Assignment.delete({id:assignment._id}, function(result) {
            callback();
          });
        },
        getAssignmentById : function(assignmentId){
          var Assignment = $resource('/api/assignment/:id', {id:'@id'});
          var assignment = Assignment.get({id:assignmentId});
          return assignment;
        },
        updateAssignment : function(assignmentForUpdate, callback){

          var Assignment = $resource('/api/assignment/:id',
      			{id:'@_id'},
      			{update:{method:'PUT'}});

            var assignment = new Assignment(assignmentForUpdate);

            assignment.$update(callback);

        },
        getAssignmentHistory : function(assignmentId, callback) {
          console.log(assignmentId);
          var AssignmentVer = $resource('/api/assVer/:id', {id:assignmentId});
          var assVer = AssignmentVer.query();
          assVer.$promise.then(function(result) {
            callback(result);
          });
        }

      };
    });
})(angular);
