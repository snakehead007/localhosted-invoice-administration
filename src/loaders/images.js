const fs = require("fs");
const path = require("path");
const Profile = require("../models/profile");


const deleteFolderRecursive = function (_path) {
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

/** Load all images from the database into public/[ID]/logo.jpeg
 *
 * @param app
 * @returns {Promise<void>}
 */
module.exports.images = async function images(app) {
    //delete everything in images
    await deleteFolderRecursive("public/images");

    //create new empty folder images
    await fs.mkdirSync("public/images");

    //restore all profile.logoFile in database
    await Profile.find({}, async function (err, profiles) {
        if (err) console.trace(err);
        for (let profile of profiles) {
            //create folder for user
            try {
                await fs.mkdirSync("public/images/" + profile.fromUser);
            } catch (error) {
            }
            //add logo to user folder
            try {
                if (typeof profile.logoFile.data !== "undefined" || !profile.logoFile) {
                    await fs.writeFile("public/images/" + profile.fromUser + "/logo.jpeg", profile.logoFile.data, function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
            } catch (e) {

            }
        }
    });
};