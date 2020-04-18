const mongoose = require("mongoose");
const Broadcast = new mongoose.Schema({
    type:{
        type:String,
        default:"info" //Others are: danger, warning, secondary, all bootrstrap colors
    },
    message:String
});

const broadcast = mongoose.model('Broadcast', Broadcast);
module.exports = broadcast;