var express = require('express');

var routes = function(Task){

  var taskRouter = express.Router();

  taskRouter
    .get('/', function(req, res){
      var task = {};
      if(req.query.title){
          task = {
            title: new RegExp(req.query.title, 'i')
        };
      }
      Task.find(task, function(err,data){
        res.send(data);
      });
    })

    .get('/:id', function(req,res,next){
      Task.findOne({
        '_id':req.params.id
      }, function(err,data){
        if(err){
          next(err);
        }
        res.send(data);
      });
    })

    .post('/', function(req, res, next){
      var task = new Task(req.body);
      task.save(function(err, data){
        if (err) {
          next(err);
        }
        res.json(data);
      });
    })

    .put('/:id', function(req,res,next){
      Task.findOne({
        '_id': req.params.id
      }, function(err, task){
          if(err){
            next(err);
          }

          var newTask = req.body;
          task.lable = newTask.lable;
          task.title = newTask.title;
          task.description = newTask.description;
          task.priority = newTask.priority;
          task.status = newTask.status;

          task.save(function(err, data){
            if(err){
              next(err);
            }
            res.json(data);
          });
      });
    })

    .delete('/:id', function(req, res, next){
      Task.remove({
        '_id': req.params.id
      }, function(err, successIndicator){
          if(err){
            next(err);
          }
          res.json(successIndicator);
        });
    });

    return taskRouter;
};

module.exports = routes;
