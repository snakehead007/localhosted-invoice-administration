import mongoose from 'mongoose';

const Settings = new mongoose.Schema({
    lang: {
        type: String,
        default: "nl"
    },
    theme: {
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
    pass: {
        type:String,
        default:"cGFzc3dvcmQ="
    },
    vatPercentage: {
        type: Number,
        default: 21
    }
});

export default mongoose.model('Settings', Settings);