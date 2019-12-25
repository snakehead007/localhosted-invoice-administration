import mongoose from 'mongoose';
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");

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
        salt: String,
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

User.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
    return token;
};


function validate(user) {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    };

    return Joi.validate(user, schema);
}

model.exports.validate = validate;
export default mongoose.model('User', User);


