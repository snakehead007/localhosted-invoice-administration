const mongoose = require('mongoose');

const Settings = new mongoose.Schema({
    mail:{
        type:String
    }
});

const settings = mongoose.model('Settings', Settings);
module.exports = settings;