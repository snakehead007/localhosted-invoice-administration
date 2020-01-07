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
    fromUser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const item = mongoose.model('Item', Item);
module.exports = item;