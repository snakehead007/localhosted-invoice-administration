const mongoose = require("mongoose");

const Profile = new mongoose.Schema({
    firm: String,
    name: String,
    street: String,
    streetNr: String,
    postal: String,
    place: String,
    iban: String,
    bic: String,
    vat: String,
    invoiceNrCurrent: {
        type: Number,
        default: 1,
    },
    offerNrCurrent: {
        type: Number,
        default: 1,
    },
    creditNrCurrent: {
        type: Number,
        default: 1,
    },
    tel: String,
    email: String,
    bookmarks: [[String, String]],
    bookmarksText: String,
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, logoFile: {
        data: Buffer,
        contentType: String
    },
    isRemoved: {
        type:Boolean,
        default:false
    }
});

const profile = mongoose.model('Profile', Profile);

module.exports = profile;