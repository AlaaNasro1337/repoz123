const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
        
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    //Bcrypt function to hash password 
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;
        //changes password to hash and saves user to DB
        newUser.password = hash;
        newUser.save(callback);
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    //Bcrypt function to compare hashed passwords
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
}