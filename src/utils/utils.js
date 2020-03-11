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
    /*
    gm(path).size(function (err, size) {
        if(err) console.trace(err);
        console.log(size);
            if (!err) {
                width=size.width;
                height=size.height;
            }
        });
    */
};