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
        },
        color:{
            type:String,
            default:"grey"
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
    },
    baseconeMail:{
        type:String
    },currency:{
        type:String,
        default:'EUR'
    },table:{
        invoices:{
            client:{
                type:Boolean,
                default:true
            },
            date:{
                type:Boolean,
                default:true
            },
            totalExl:{
                type:Boolean,
                default:false
            },
            totalIncl:{
                type:Boolean,
                default:true
            },
            status:{
                type:Boolean,
                default:true
            },
            action:{
                type:Boolean,
                default:true
            }
        }
    }
});
//CURRENCY ISO: https://www.xe.com/iso4217.php
const settings = mongoose.model('Settings', Settings);
module.exports = settings;
