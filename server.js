// Setup basic express server
var express = require('express');
var app = express();
const mongo = require('mongodb').MongoClient;           //MONGODB
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;                    //PORT=XXXX node server.js will run on port XXXX

//Set server to given port or 4000 if none given.
server.listen(port, function(){
    console.log('Server listening at port %d', port);
}); 

//Serves Static Files. Allows loading of files in this directory. AKA index.html, style.css, etc.
app.use(express.static(path.join(__dirname, '/')));

//Connect to MongoDB
mongo.connect('mongodb://admin:admin@ds036967.mlab.com:36967/anonchat', function(err, db){
    if(err){
        throw err;
    }
    console.log('MongoDB connected...');
   
//When a user enters webpage
io.on('connection', function(socket){
    console.log('An unknown user has connected.');
    let chat = db.collection('chats');

      //Get the last 20 messages from MongoDB
      chat.find().limit(20).sort({_id:-1}).toArray(function(err, res){
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
                chat.insert({name: name, message: msg}, function(){
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
});
});