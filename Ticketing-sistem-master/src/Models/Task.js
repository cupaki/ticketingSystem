var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    lable: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userCreated: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

var Task = mongoose.model('Task', taskSchema);
module.exports = Task;
