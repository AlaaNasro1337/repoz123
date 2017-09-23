const mongoose = require('mongoose');
const User = require('../models/users');

//Message Schema
const ChatSchema = mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String, ref: 'User'
        //type: String
    },
    message: {
        type: String
    }
});

const Chat = module.exports = mongoose.model('Chat', ChatSchema, 'ChatDB');