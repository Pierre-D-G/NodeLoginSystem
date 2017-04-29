var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
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


userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// Method for checking if password is valid by comparing it to the hashed password in the database
userSchema.methods.validPassword = function (passw, cb) {
    bcrypt.compareSync(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cd(null, isMatch);
        }
    });
};

module.exports = mongoose.model('User', userSchema);

// module.exports.createUser =  function(newUser, callback){
//     bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10), function(err){
//       if(err) throw err;
//     newUser.password = newUser.generateHash(newUser.password);
//     newUser.save(callback);
//     });
// };