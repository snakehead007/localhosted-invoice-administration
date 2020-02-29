const mongoose = require("mongoose");

const Client = new mongoose.Schema({
    firm: String,
    clientName: {
        type: String,
        index: true
    },
    street: String,
    streetNr: String,
    postalCode: String,
    place: String,
    vatPercentage: {
        type: Number,
        default: 21
    },
    vat: String,
    country: String,
    email: [{
        type: String,
        lowercase: true
    }],
    bankNr: String,
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        Ref: 'Invoice'
    }],
    project: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    lang: {
        type: String,
        default: "en-GB"
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    lastUpdated: {
        type: Date,
        default: Date.now()
    },
    locale: {
        type: String,
        default: 'nl-BE'
    },
    isRemoved: {
        type:Boolean,
        default:false
    }
});

const client = mongoose.model('Client', Client);
module.exports = client;