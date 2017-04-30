var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user');


router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

// Registering User
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

   User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
      console.log("Successfully created a user!")
    });

    req.flash('success_msg', 'You have registered successfully and can now login');

    res.redirect('/users/login');
  }
});

passport.use(new localStrategy(function (username, password, done) {
  // Checking if username exists
  User.getUserByUsername(username, function (err, user) {
      if (err) throw err;
      if (!user) {
        console.log('Username doesnt exist!');
        return done(null, false, {
          message: 'Username not found'
        })
      }

      //Comparing password at login to password in database
      User.validPassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if(isMatch){
          return done(null, user)
        }else{
          console.log('Invalid Password');
          return done(null, false, {message: 'Invalid Password'})
        }
      });
    });
}));

// Passport Authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});


router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
  }),
  function (req, res) {
    console.log('Authentication Successful')
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });



module.exports = router;