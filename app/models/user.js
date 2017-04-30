var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var database = mongoose.connection;


mongoose.connect("mongodb://localhost/nodeauth");

// User mongoose schema
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    username: {
        type: String,
        index: true
    },
});




var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserByUsername = function(username, cb){
    query = {username: username};
    User.findOne(query, cb)
}


module.exports.getUserById = function(id, cb){
    User.findById(id, cb)
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.validPassword = function (userPassword, hash, cb) {
    bcrypt.compare(userPassword, hash, function (err, isMatch) {
        if (err) throw err;
        cb(null, isMatch);
    });
};