const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
    firm: String,
    name: String,
    street: String,
    streetNr: String,
    postal: String,
    place: String,
    vat: String,
    iban: String,
    bic: String,
    invoiceNrCurrent : {
        type: Number,
        default: 1,
    },
    offerNrCurrent : {
        type: Number,
        default: 1,
    },
    creditNrCurrent : {
        type: Number,
        default: 1,
    },
    tel: String,
    mail: [String],
    bookmarks: [[String,String]],
    bookmarksText: String,
})

module.exports.default =  mongoose.model('Profile', Profile);