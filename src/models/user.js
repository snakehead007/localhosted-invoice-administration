const mongoose = require('mongoose');

const User = new mongoose.Schema({
        name: {
            type: String,
        },
        googleId:{
            type:String,
            unique:true
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
        role: {
            type: String,
            default: 'user',
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
        tokens: [{
            type: Object
        }]
    }
);



const user = mongoose.model('User', User);

exports.getUserFromGoogleId = async (gId) => {
    user.findOne({googleId:gId},function(err,User){
        if(err) throw new Error(err);
        return User;
    });
};

exports.getUserIdFromGoogleId = async(gId) => {
    user.findOne({googleId:gId},function(err,User){
        if(err) throw new Error(err);
        return User._id;
    })
};

module.exports = user;

