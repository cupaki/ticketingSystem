var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = require('./Comment');

var assignmentSchema = new Schema({
    label: {
        type: String,
        required: true,
    },
    version: {
        type: Number
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    createdAt: Date,
    updatedAt: Date,
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    userCreated: {
      type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    done: {type:Boolean},

});

assignmentSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.version++;
    this.updatedAt = currentDate;

    if (!this.createdAt) {
        this.createdAt = currentDate;
    }

    next();
});

var AssignmentSchema = mongoose.model('Assignment', assignmentSchema);

module.exports = AssignmentSchema;
