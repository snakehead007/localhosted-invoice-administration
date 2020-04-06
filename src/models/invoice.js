const mongoose = require('mongoose');

const Invoice = new mongoose.Schema({
    date: {
        type:Date,
        default:Date.now()
    },
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
    firmName:String,
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
    },
    isSend:{
        type:Boolean,
        default:false
    },
    sendDate:Date,
    isVatOn:{
        type:Boolean,
        default:false
    },
    isSendToBasecone:{
        type:Boolean,
        default:false
    }
});

const invoice = mongoose.model('Invoice', Invoice);
module.exports = invoice;