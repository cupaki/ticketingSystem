var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    createdAt: Date,
    updatedAt: Date,
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }],
    startDate: Date,
    endDate: Date,
    lable: String,
    category: String,
    client: String,
    assignment: [{
      type: Schema.Types.ObjectId,
      ref: 'Assignment'
    }]
});

projectSchema.pre('save', function(next) {
    var currentDate = new Date();

    this.updatedAt = currentDate;

    if (!this.createdAt) {
        this.createdAt = currentDate;
    }

    next();
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;
