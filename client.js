//waits until page is ready for javascript
$(function() {

//allows socket connections
var socket = io();
    console.log('Connected to socket...');
          
    //sign in button enter and button press
    $("#username").keyup(function(event){
        if(event.keyCode == 13){                                    //if enter key pressed
            $("#signInBtn").click();
        }
    });
    $('#signInBtn').click(function(){
        socket.emit('name input', $("#username").val());            //Send 'name input' to server
        $(this).prop("disabled",true);                              //Disable text box and button after sent
        $("#username").prop("disabled",true); 
        $('#textarea').focus();                                     //change focus to #textarea  
    });
    
    //send 'message sent' to server
    $('#textarea').keypress(function(event){
        if(event.keyCode == 13 ){                                     // if enter key pressed 
            event.preventDefault();                                   //prevent next line on enter key press
            socket.emit('message sent', $("#textarea").val());        //send message to server
            $("#textarea").val("");                                   //clear textbox after msg sent
        }
    });

    
    //When server emits 'new message', update chat body
    socket.on('new message', function(data){
        $('<div/>').text(data.username+":  " +data.message).appendTo($('#chat-area'));      //creates new div with text and appends to 'chat-area' div
        $('#chat-area')[0].scrollTop = $('#chat-area')[0].scrollHeight;                     //sets chat area to stay scrolled down
    });

    //reloads when disconnected from server
    socket.on('disconnect', function(){
        console.log('Disconnected from socket...');
        location.reload();
    });

    //displays old messages from MongoDB
    socket.on('display old messages', function(res){
        if(res.length){
            for(var x=0; x<res.length; x++){
                $('<div/>').text(res[x].name+":  " +res[x].message).prependTo($('#chat-area'));
                $('#chat-area')[0].scrollTop = $('#chat-area')[0].scrollHeight;
                //console.log(res[x]);
            }
        }
    });
          
});