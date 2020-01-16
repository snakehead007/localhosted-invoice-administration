const fs = require('fs');
const path = require('path');
//Load all images from the database into public/[ID]/logo.jpeg
module.exports.images = function images(app) {
  deleteFolderRecursive(path.join(path.resolve(),'public/images'));

};

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            const curPath = path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};