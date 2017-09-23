const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

//configuration file for DB
const config = require('./config/database');

//Sets server to 3000 if no port specified
var port = process.env.PORT || 3000;

//Serves Static Files. Allows loading of files in listed directory.
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser Middleware. Grab data from submitted forms, etc.
app.use(bodyParser.json());

//Cors Middleware. Request to API from different domain names
//app.use(cors());

//Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Routing
const chat = require('./routes/chat');
app.use('/', chat);

//Start server 
server.listen(port, function(){
    console.log('Server listening at port %d', port);
}); 

//Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {useMongoClient: true}, function(err){
    if(err) throw err;
    console.log('MongoDB connected...');
});
   
/*   //When a user enters webpage
  io.on('connection', function(socket){
    console.log('An unknown user has connected.');
    let chats = db.collection('chats');

      //Get the last 20 messages from MongoDB
      chats.find().limit(20).sort({_id:-1}).toArray(function(err, res){
        if(err){
            throw err;
        }

        //Emit the previous messages from DB
        socket.emit('display old messages',res);
    });

    //When a user leaves webpage
    socket.on('disconnect', function(){
        console.log('An unknown user has disconnected.');
    });

    //When a user signs in
	socket.on('name input', function(name){
	    if (name != ''){
   	        console.log(name + " has signed in.");
        }
        //when user sends message
        socket.on('message sent', function(msg){
            if (msg != ''){
                console.log(name + ": " + msg);
                chats.insert({name: name, message: msg}, function(){
                    io.emit('new message', {
                        username: name,
                        message: msg
                    });
                });
            }
        });

        //when signed in user leaves
        socket.on('disconnect', function(){
            console.log(name+" has disconnected.");
        });
    });
  }); */