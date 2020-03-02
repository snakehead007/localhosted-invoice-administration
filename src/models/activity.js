const mongoose = require("mongoose");

const Activity = new mongoose.Schema({
    type:{
        type:String,
        default:"time" //Others are: delete , add , edit , download
    },
    //description and info will be put together, this makes it easier to translate.
    description: String, //description example: "Deleted client"
    info: String,  //info example: "Nestle inc. Pierre Jacques"
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    withObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        isRequired: true
    },
    objectName:String,
    time:{
        type:Date,
        default:Date.now()
    }
});

const activity = mongoose.model('Activity', Activity);
module.exports = activity;