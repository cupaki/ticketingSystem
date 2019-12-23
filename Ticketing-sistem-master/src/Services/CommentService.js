(function(angular) {
  var app = angular.module('app');

  app.factory('CommentData', function($resource) {
    return {
      getComments : function(projectId){
        var ProjectComments = $resource('/api/project/id/comment', {
          id:'@id'
        });
        var commnets = ProjectComments.query();
        return commnets;
      },
      addComment: function(comment, assignmentId){
        var Comment = $resource('api/comment/assignment/:id', {id:'@id'});
        var newComment = new Comment(comment);
        newComment.$save({id:assignmentId});
        console.log(' upisao se sada');
      //  Comment.save(comment);
      },
      removeComment: function(comment) {
        var Comment = $resource('/api/comment/:id', {id:'@id'});
        Comment.delete({id:comment._id});
      },
      updateComment : function(commentForUpdate){

        var Comment = $resource('/api/comment/:id',
          {id:'@_id'},
          {update:{method:'PUT'}});

          var comment = new Comment(commentForUpdate);
          comment.$update();
      }
    };
  });
})(angular);
