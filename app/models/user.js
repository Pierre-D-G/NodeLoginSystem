var mongoose = require('mongoose');
var database = mongoose.connection;


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, userNew){
    newUser.save(userNew);
}