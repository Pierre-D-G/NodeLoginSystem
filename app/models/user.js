var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var database = mongoose.connection;


mongoose.connect("mongodb://localhost/nodeauth");

// User mongoose schema
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: {
        type: String,
        required: true,
        bcrypt: true
    }
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function (newUser, userNew) {
    // Encrytping use passwords
    var hash = bcrypt.hashSync(newUser.password, 10);
        // set password to hash
        newUser.password = hash;
        newUser.save(userNew);
}