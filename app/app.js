var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    exphbs = require('express-handlebars')
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local')
    bodyParser = require('body-parser'),
    ExpressValidator = require('express-validator'),
    flash = require('connect-flash'),
    mongo = require('mongodb'),
    mongoose = require('mongoose')
    

mongoose.connect("mongodb://localhost/nodeauth")

// ROUTES
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir:'app/views/layouts'
}));
app.set('view engine', 'handlebars');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Validator

app.use(ExpressValidator({
 errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle express sessions

app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error');
//   res.redirect('users/register')
// });

module.exports = app;
