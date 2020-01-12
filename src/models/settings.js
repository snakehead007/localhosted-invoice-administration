const mongoose = require('mongoose');

const Settings = new mongoose.Schema({
    locale: {
        type: String,
        default: "nl-BE"
    },
    thema: {
        type:String,
        default: "secondary"
    },
    variables: [
        {/*s1*/
            type: Number,
            default: 0.039
        },
        {/*s2*/
            type: Number,
            default: 0.0185
        },
        {/*s3*/
            type: Number,
            default: 2.23
        },
        {/*s4*/
            type: Number,
            default: 13.5
        },
        {/*e1*/
            type: Number,
            default: 0.018
        },
        {/*e2*/
            type: Number,
            default: 0.018
        },
        {/*e3*/
            type: Number,
            default: 2
        },
        {/*e4*/
            type: Number,
            default: 11
        },
    ],
    invoiceText: {
        type: String,
        default: ""
    },
    creditText: {
        type: String,
        default: ""
    },
    offerText:{
        type: String,
        default: ""
    },
    vatPercentage: {
        type: Number,
        default: 21
    },
    fromUser:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
});

const settings = mongoose.model('Settings', Settings);
module.exports = settings;