var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    education : String,
    location : String,
    skills : [String],
    notes: String,
    picture: String,
    jobTitle: String,
    experience: String,
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    assignments : [{type: Schema.Types.ObjectId, ref: 'Assignment'}]

});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  console.log('Provera sifre');
  console.log(password);
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
