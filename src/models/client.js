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
    vat: String,
    country:String,
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
    }]
});

module.exports.default = mongoose.model('Client',Client);