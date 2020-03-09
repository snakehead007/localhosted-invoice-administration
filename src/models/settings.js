const mongoose = require('mongoose');

const Settings = new mongoose.Schema({
    locale: {
        type: String,
        default: "nl-BE"
    },
    theme: {
        type: String,
        default: "dark"
    },
    pdf: {
        titleSize: {
            type: Number,
            default: 38
        },
        noLogo:{
            type:Boolean,
            default:false
        }
    },
    invoiceText: {
        type: String,
        default: ""
    },
    creditText: {
        type: String,
        default: ""
    },
    offerText: {
        type: String,
        default: ""
    },
    vatPercentage: {
        type: Number,
        default: 21
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const settings = mongoose.model('Settings', Settings);
module.exports = settings;