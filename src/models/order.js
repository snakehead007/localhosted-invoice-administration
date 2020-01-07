const mongoose = require("mongoose");

const Order = new mongoose.Schema({
    description: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
})

const order =  mongoose.model('Order', Order);
module.exports = Order;