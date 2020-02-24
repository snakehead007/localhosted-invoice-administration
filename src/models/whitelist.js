const mongoose = require('mongoose');

const Whitelist = new mongoose.Schema({
    mail: {
        type: String
    }
});

const whitelist = mongoose.model('Whitelist', Whitelist);
module.exports = whitelist;