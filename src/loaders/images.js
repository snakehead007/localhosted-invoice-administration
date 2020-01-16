const fs = require('fs');
const path = require('path');
const Profile = require('../models/profile');

//Load all images from the database into public/[ID]/logo.jpeg
module.exports.images = async function images(app) {
    //delete everything in images
    deleteFolderRecursive(path.join(path.resolve(),'public/images'));

    //create new empty folder images
    await fs.mkdirSync('public/images');

    //restore all profile.logoFile in database
    await Profile.find({},async function(err,profiles){
       if(err) console.trace(err);
       for(let profile of profiles){
           //create folder for user
           await fs.mkdirSync('public/images/' + profile.fromUser);
           //add logo to user folder
           try{
               if(typeof profile.logoFile.data !== "undefined") {
                  // fs.writeFile(path.join(path.resolve(),'public/images/')+profile.fromUser, profile.logoFile.data);
                   await fs.writeFile('public/images/' + profile.fromUser+'/logo.jpeg', profile.logoFile.data, function (err) {
                       if (err) throw err;
                       if (!err){
                       }
                   });
               }
           }catch(e){
               console.trace("[Error]: "+e);
           }
       }
    });

    ///TODO: check if any folder is empty delete them
    /// ...
    console.log('[Info]: Wrote images/, all logo of profile written to disk');
};

const deleteFolderRecursive = function(_path) {
    if (fs.existsSync(_path)) {
        fs.readdirSync(_path).forEach((file, index) => {
            const curPath = path.join(_path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(_path);
    }
};