var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: String,
    createdAt: Date,
    updatedAt: Date,
    comment: {
      type:String,
      required: true
    }
});

commentSchema.pre('save', function(next){
  var currentDate = new Date();

  this.updatedAt = currentDate;

  if(!this.createdAt){
    this.createdAt = currentDate;
  }

  next();
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
