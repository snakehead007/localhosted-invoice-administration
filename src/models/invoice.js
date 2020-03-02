const mongoose = require('mongoose');

const Invoice = new mongoose.Schema({
    date: Date,
    datePaid: Date,
    invoiceNr: Number,
    offerNr: Number,
    creditNr: Number,
    isPaid: {
        type: Boolean,
        default: false
    },
    isAgreed: {
        type:Boolean,
        default:false
    },
    advance: {
        type: Number,
        default: 0
    },
    clientName: String,
    total: {
        type: Number,
        default: 0
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }],
    fromClient: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client'
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    lastUpdated: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
        default: ""
    },
    isRemoved: {
        type:Boolean,
        default:false
    }
});

const invoice = mongoose.model('Invoice', Invoice);
module.exports = invoice;