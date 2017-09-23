const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');
const config = require('../config/database');

module.exports = function(passport){
    let opts = {};
    //Defines where tokens is (Header)
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    //JWT Key
    opts.secretOrKey = config.secret;
    //verify token's signature with key
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        //jwt_payload is decoded jwt data
        //console.log(jwt_payload);

        //gets user by ID from payload data (from header)
        User.getUserById(jwt_payload.data, function(err, user){
            if(err){
                return done(err, false);
            }
            //Checks if user ID matches
            if(user){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }))
}