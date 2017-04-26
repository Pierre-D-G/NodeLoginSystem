var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('User Panel')
});

router.get('/register', function (req, res, next) {
  res.render('register')
});

router.get('/login', function (req, res, next) {
  res.render('login')
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

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
  });

  // if (errors) {
  //   // show register page if any validation errors
  //   res.render('register', {
  //     errors: errors,
  //     // To keep fields that pass validate the same instead of clearing them if there is a validation error
  //     name: name,
  //     email: email,
  //     username: username,
  //     password: password,
  //     password2: password2
  //   })
  // } else {
  //   var newUser = new user({
  //     name: name,
  //     email: email,
  //     username: username,
  //     password: password,
  //     profileImage: profileImageName
  //   });
  //  Creating User
  //     User.createUser(newUser, function (err, user) {
  //       if (err) throw err;
  //       console.log(user);
  //     });
  //     // Message to user for successful registration
  //     req.flash('success', 'You have been registered successly and can now login');
  //     // Takie user back to home page
  //     res.location('/');
  //     res.redirect('/');
// });

module.exports = router;
