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
    }
});

const item = mongoose.model('Item', Item);
module.exports = Item;