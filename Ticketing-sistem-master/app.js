var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

/*var morgan = require('morgan');
global.__base = __dirname + '/';*/

//Models
var Project = require(__dirname + '/src/Models/Project');
var User = require(__dirname + '/src/Models/User');
var Team = require(__dirname + '/src/Models/Team');
var Assignment = require(__dirname + '/src/Models/Assignment');
var Task = require(__dirname + '/src/Models/Task');
var Comment = require(__dirname + '/src/Models/Comment');
var AssignmentVersion = require(__dirname + '/src/Models/AssignmentVersion');
//Routers


var projectRouter = require('./src/Routes/ProjectRouter')(Project, Team, User);
var userRouter = require('./src/Routes/UserRouter')(User);
var authRouter = require('./src/Routes/AuthRouter')(User);
var assignmentRouter = require('./src/Routes/AssignmentRouter')(Assignment, User, Project, AssignmentVersion);
var taskRouter = require('./src/Routes/TaskRouter')(Task);
var commentRouter = require('./src/Routes/CommentRouter')(Comment, Assignment);
var teamRouter = require('./src/Routes/TeamRouter')(Team, User, Project);
var adminRouter = require('./src/Routes/AdminRouter')();
var assignmentVer = require('./src/Routes/AssignmentVerRouter')(AssignmentVersion);

//Database
mongoose.connect('mongodb://localhost/ticketing', function() {
    //mongoose.connection.db.dropDatabase();
});

var app = express();

//Midlewares
//app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret: 'wholikescookies', cookie: { maxAge: 1000 * 60 * 60 * 24 }}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//Authentification Midleware
require('./src/config/passport')(passport, app, User);
//Routes Midleware

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/project', projectRouter);
app.use('/api/assignment', assignmentRouter);
app.use('/api/task', taskRouter);
app.use('/api/comment', commentRouter);
app.use('/api/team', teamRouter);
app.use('/api/assVer', assignmentVer);


//klijentsku angular aplikaciju serviramo iz direktorijuma client
app.use('/', express.static(__dirname + '/src/View'));
app.use('/templates', express.static(__dirname + '/src/Templates'));
app.use('/templates/admin', express.static(__dirname + '/src/Templates/admin'));
app.use('/lib', express.static(__dirname + '/public/lib'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/src/View/Controllers', express.static(__dirname + '/src/View/Controllers'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/plugins', express.static(__dirname + '/public/plugins'));

var port = process.env.PORT || 5000;

//Start
app.listen(port, function() {
    console.log('Running on port ' + port);
});
