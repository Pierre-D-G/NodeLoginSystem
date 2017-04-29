var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user');

router.get('/', function (req, res, next) {
  res.send('User Panel');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/register', function (req, res, next) {
  // Getting form data
  var name = req.body.name,
    email = req.body.email,
    username = req.body.username,
    password = req.body.password,
    confirmPassword = req.body.confirmPassword

  // Form Validation with express validator
  req.checkBody('name', 'A name is required to register').notEmpty();
  req.checkBody('email', 'You have entered an invalid email address').isEmail();
  req.checkBody('username', 'Please choose a username').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);


  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    newUser.save(function (err, user) {
      if (err) throw err;
      console.log(user);
      console.log("Successfully created a user!")
    });

    req.flash('success_msg', 'You have registered successfully and can now login');

    res.redirect('/users/login');
  }
});

// Passport Authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// User Authentication
router.post('/login', function (req, res, next) {
      // Checking if username exists
      User.findOne({ username: req.body.username }, function (err, user) {
        if (err) throw err;
        if (!user) {
          console.log('Username does not exist');
        } else {
          //  Checking if passwords match
          user.validPassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              console.log('SuccessFul Login!')
            } else {
              console.log('Invalid Password')
            }
          });
        }
    });
});  

  module.exports = router;
