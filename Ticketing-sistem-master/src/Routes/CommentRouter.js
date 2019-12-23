var express = require('express');

var routes = function(Comment, Assignment) {
    var commentRouter = express.Router();

    commentRouter
        .get('/', function(req, res, next) {
        console.log('OVDE 1');

            Comment.find({}).populate('author').exec(function(err, data){
              if(err){
                next(err);
              }
              else{
                console.log(data + ' DATAAAA');
                    res.send(data);
              }
          });

        })
        .get('/:id', function(req, res, next) {
            console.log('OVDE 2');
          Comment.findOne({
            '_id':req.params.id
          }, function(err, data) {
            if (err) {
              next(err);
            }
          }).populate('author').exec(function(err, data){
            console.log(data + ' DATAAAA2');
              res.send(data);
          });
        })

        .get('/assignment/:id', function(req, res, next) {
        console.log('OVDE 3');

        var query = Comment.find({});
        query.where('assignment', req.params.id);
        query.populate('author');
        query.exec(function(err, data){
          if(err){
            next(err);
          }
          console.log(data + ' DATA ');
          res.json(data);
        });

        })

        .post('/assignment/:id', function(req, res, next){

          var assignmentId = req.params.id;
          var comment = new Comment(req.body);
          console.log(comment + ' komentar');


        /*  Assignment.findOne({'_id':req.params.id},function (err, assign) {
          if(err){
             next(err); }
          comment.save(function (err, comment) {
            if(err) {next(err);}
            Assignment.findByIdAndUpdate(assign._id, {$push:{'comments':comment._id}}, function (err, entry) {
              if(err) {next(err);}
              res.json(entry);
      });
    });
  });*/

                         Assignment.findByIdAndUpdate(assignmentId, {$push:{'comments':comment._id}}, function (err, entry) {
                           if(err) {next(err);}
                           comment.save(function(err,com){
                             if(err){
                               next(err);
                             }
                             res.json(com);
                           });

                    });


        })

        .put('/:id', function(req, res, next){
          Comment.findOne({
            '_id' : req.params.id
          }, function(err, comment){
            if (err) {
              next(err);
            }
            var newComment = req.body;
            comment.comment = newComment.comment;

            comment.save(function(err, data) {
              if (err) {
                next(err);
              }
              res.json(data);
            });
          });
        })
        .delete('/:id', function(req, res, next){
          Comment.remove({
            '_id':req.params.id
          }, function(err, successIndicator) {
            if (err) {
              next(err);
            }
            res.json(successIndicator);
          });
        });
    return commentRouter;
};

module.exports = routes;
