const fs = require('fs');
const path = require('path');
const Profile = require('../models/profile');

/** Load all images from the database into public/[ID]/logo.jpeg
 *
 * @param app
 * @returns {Promise<void>}
 */
module.exports.images = async function images(app) {
    //delete everything in images
    await deleteFolderRecursive('public/images');

    //create new empty folder images
    await fs.mkdirSync('public/images');

    //restore all profile.logoFile in database
    await Profile.find({},async function(err,profiles){
       if(err) console.trace(err);
       for(let profile of profiles){
           //create folder for user
           try {
               await fs.mkdirSync('public/images/' + profile.fromUser);
               if(process.env.LOGGING>2)
                    console.log("[DEBUG]: mkdir public/images/"+ profile.fromUser);
           }catch(error){
               if(process.env.LOGGING>2)
                    console.log("[Error]: Got error in making directory");
               if(process.env.LOGGING>2)
                    console.trace("[Error]: "+error);
           }
           //add logo to user folder
           try{
               if(typeof profile.logoFile.data !== "undefined") {
                   await fs.writeFile('public/images/' + profile.fromUser+'/logo.jpeg', profile.logoFile.data, function (err) {
                       if (err) {
                           if(process.env.LOGGING>2){
                               console.trace("[Error]: "+err);
                           }
                           throw err;
                       }
                       if(!err){
                           if(process.env.LOGGING>2)
                                console.log("[DEBUG]: mkdir public/images/"+ profile.fromUser+"/logo.jpeg");
                       }
                   });
               }
           }catch(e){
               if(process.env.LOGGING>2)
                    console.trace("[Error]: "+e);
           }
       }
    });

    ///TODO: check if any folder is empty delete them
    /// ...
    if(process.env.LOGGING>1)
        console.log('[Info]: Wrote images/, all logo of profile written to disk');
};

const deleteFolderRecursive = function(_path) {
    if (fs.existsSync(_path)) {
        fs.readdirSync(_path).forEach((file, index) => {
            const curPath = path.join(_path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                if(process.env.LOGGING>2)
                    console.log("[DEBUG]: rm "+curPath);
                fs.unlinkSync(curPath);
            }
        });
        if(process.env.LOGGING>2)
            console.log("[DEBUG]: rm "+_path);
        fs.rmdirSync(_path);
    }
};