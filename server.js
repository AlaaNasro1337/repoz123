//Express Module
var express = require('express');
var app = express();
var path = require('path');
//Socket.io Module
var server = require('http').Server(app);
var io = require('socket.io')(server);
//MongoDB module
var mongo = require('mongodb').MongoClient;


//Serves Static Files. Allows loading of files in listed directory.
app.use(express.static(path.join(__dirname, '/')));

//PORT=XXXX node server.js will run on port XXXX
//Else, sets server to 3000 if no port specified
var port = process.env.PORT || 3000;

//Start server 
server.listen(port, function(){
    console.log('Server listening at port %d', port);
}); 

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