var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Assignment = require('./Assignment').schema;

var assignmentSchema = new Schema({
    version: {
        type: Number,
        required: true
    },
    originalAssignment : {
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    assignment: [Assignment],
    createdAt: Date

});

assignmentSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.createdAt = currentDate;
    this.version++;

    next();
});

var AssignmentSchema = mongoose.model('AssignmentVersion', assignmentSchema);

module.exports = AssignmentSchema;
