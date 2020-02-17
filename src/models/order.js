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
    },
    fromUser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    fromInvoice:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Invoice'
    },
    fromClient:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Client'
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

const order =  mongoose.model('Order', Order);
module.exports = order;
