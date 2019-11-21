const mongoose = require('../database/db');
const bcrypt = require('bcrypt')
const MessagesSchema = new mongoose.Schema({
    chatName: {
        type: String,
        require: true,
    },
    messages: {
        type: Array,
        require: false,
    }

});


const messages = mongoose.model('messages', MessagesSchema);

module.exports = messages;