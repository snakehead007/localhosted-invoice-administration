const mongoose = require( "mongoose");

const Item = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    type: {
        type:String,
        default: "g"
    },
    fromUser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    creationDate:{
        type:Date,
        default:Date.now()
    },
    lastUpdated:{
        type:Date,
        default:Date.now()
    }
});

const item = mongoose.model('Item', Item);
module.exports = item;