const gm = require("gm");
const sizeOf = require('image-size');
const fs = require('fs');
exports.getIp = (req) => {
    return (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

exports.getSizeOfImage = (path) => {
    sizeOf(path, function (err, dimensions) {
        if(err) console.trace(err);
        return {
            w:dimensions.width,
            h:dimensions.height
        };
    });
};

exports.getReformatedImageSize = (sizeOfObj,defaultSize=200) => {
    let ratio = sizeOfObj.width/sizeOfObj.height;
    let width = defaultSize;
    let height= defaultSize;
    if(ratio>2.5||ratio<0.25){
        height = height/3;
        width = width/3;
    }else if(ratio>1.75||ratio<0.75){
        height = height/1.5;
        width = width/1.5;
    }
    if(ratio>1.0){
        width = width * ratio;
    }else if(ratio<1.0){
        height= height * sizeOfObj.height/sizeOfObj.width;
    }
    console.log(height);
    console.log(width);
    return {
        height:height,
        orientation: sizeOfObj.orientation,
        width:width,
        type: sizeOfObj.type
    };
};