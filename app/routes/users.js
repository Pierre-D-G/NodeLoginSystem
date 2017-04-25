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

router.post('/users/register', function (req, res, next) {
  // Getting form data
  var name = req.body.name,
    email = req.body.email,
    username = req.body.username,
    password = request.body.password,
    password2 = req.body.password2

  // Checking for images field
  if (req.files.profileImage) {
    console.log('Uploading file');

    //  file info
    var profileImageOriginalName = req.files.profileImage.originalname,
      profileImageName = req.files.profileImage.name,
      profileImageMime = req.files.profileImage.mimetype,
      profileImagePath = req.files.profileImage.path,
      profileImageExt = req.files.profileImage.extension,
      profileImageSize = req.files.profileImage.size
  } else {
    // set default image
    var profileImageName = 'defaultImage.png',  // Add an image with whatever name you want the default user profile image to be into the uploads folder
  }

  // Form Validation with express validator
  req.checkBody('name', 'You cannot have a blank name').notEmpty();
  req.checkBody('email', 'An email address is required to register').notEmpty();
  req.checkBody('name', 'Please enter a valid email address').isEmail();
  req.checkBody('password', 'A password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
});

module.exports = router;
