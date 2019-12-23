var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  name: {
    type:String,
    required: true,
    unique: true
  },
  users : [{type: Schema.Types.ObjectId, ref: 'User'}],
  projects : [{type: Schema.Types.ObjectId, ref: 'Project'}]
});


var Team = mongoose.model('Team', teamSchema);

module.exports = Team;
