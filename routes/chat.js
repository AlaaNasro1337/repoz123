var express = require("express");
var router = express.Router();
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var mongoose = require("mongoose");
var passport = require('passport');
var jwt = require('jsonwebtoken');

var Chat = require("../models/chat");
var User = require("../models/users");
var config = require('../config/database');

// socket io
io.on("connection", function(socket) {
  console.log("User connected");
  socket.on("disconnect", function() {
    console.log("User disconnected");
  });
  socket.on("save-message", function(data) {
    console.log(data);
    io.emit("new-message", { message: data });
  });
});

/* GET ALL CHATS */
router.get("/chat", passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Chat.find(function(err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE CHAT */
router.post("/chat", passport.authenticate('jwt', {session: false}), function(req, res, next) {
  Chat.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// NEW USER
router.post("/register", function(req, res, next) {
  //Creates new user with inputted information
  let newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  //Hashes password and adds user to DB
  User.addUser(newUser, function(err, post) {
    if (err) {
      res.json({ success: false, msg: "Failed to register user" });
      console.log(err);
    } else {
      res.json({ success: true, msg: "User Registered" });
    }
  });
});

//Authenticate
router.post('/login', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    //Query user by username
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        //Checks if User exists in database
        if(!user){
            return res.json({success: false, msg: 'User not found'})
        }
        //Compares hashed passwords
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            //If hashed passwords match
            if(isMatch){
              //Generates a token
              const token = jwt.sign({data: user}, config.secret, {
                  expiresIn: 604800 //1 week in seconds
              });
              res.json({
                success: true,
                token: 'JWT '+token,
                user: {
                  id: user._id,
                  username: user.username,
                }
              });
            }
            else {
                return res.json({success: false, msg: 'wrong password'});
            }
        });
    });
});

module.exports = router;
