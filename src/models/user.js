const mongoose = require('mongoose');

const User = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please enter a full name']
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
            required:true,
            minlength: 5,
            maxlength: 255,
        },
        password: {
            minLength: 5,
            maxLenght: 255,
            required: true,
            type:String
        },
        salt: { type: String, default: '' },
        role: {
            type: String,
            default: 'user',
        },
        isVerificated: {
            type: Boolean,
            default: false
        },
        creationDate: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
            index: true
        },
        settings: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Settings'
        },
        items: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Item'
        }],
        profile: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Profile'
        },
    }
);

const user = mongoose.model('User', User);
module.exports = user;

