const Settings = require("../models/settings");
const User = require("../models/user");
const Profile = require("../models/profile");
const fs = require("fs");
const logger = require("../middlewares/logger");
const i18n = require("i18n");
/**
 * @apiVersion 3.0.0
 * @api {get} /upload/logo uploadLogoGet
 * @apiDescription Shows a form where you can upload a logo (only .jpeg or .jpg) file onto your profile
 * @apiName uploadLogoGet
 * @apiGroup UploadRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
     res.render("upload", {
        "settings": settings,
        "description": "Upload logo",
        "profile": profile,
        "role": role
    })
 */
exports.uploadLogoGet = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/uploadController.uploadLogoGet on method Settings.findOne trace: "+err.message);
        Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/uploadController.uploadLogoGet on method Profile.findOne trace: "+err.message);
            res.render("upload", {
                "settings": settings,
                "description": "Upload logo",
                "profile": profile,
                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                    return user
                })).role
            });
        });
    });
};
/**
 * @apiVersion 3.0.0
 * @api {post} /upload/logo uploadLogoPost
 * @apiDescription uploads the logo as binary onto the profile model in the database
 * @apiName uploadLogoPost
 * @apiGroup UploadRouter
 * @apiSuccessExample Success-Response:
    res.redirect("/view/profile/");
 * @apiErrorExample Error-Response:
    res.redirect("/upload/logo");
 */
exports.uploadLogoPost = async (req, res) => {
    try {
        if (Object.keys(req.files).length === 0) {
            logger.warning.log("[WARNING]: no file found while trying upload, files :"+req.files);
            return res.status(400).send("No files were uploaded.");
        }
        let logoFile = req.files.logoFile;
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is trying to upload logo file of mimetype "+req.files.logoFile.mimetype);
        if (logoFile.mimetype === "image/jpeg" || logoFile.mimetype === "image/jpg" || !logoFile.mimetype) {
            Profile.findOne({fromUser: req.session._id}, async function (err, profile) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/uploadController.uploadLogoPost on method Profile.findOne trace: "+err.message);
                let url = "public/images/" + req.session._id + "/logo.jpeg";
                if (!fs.existsSync("public/images/" + req.session._id)) {
                    await fs.mkdirSync("public/images/" + req.session._id);
                }
                await logoFile.mv(url);
                profile.logoFile.data = fs.readFileSync(url);
                profile.logoFile.contentType = "image/jpeg";
                await profile.save((err)=>{
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/uploadController.uploadLogoPost on method Profile.save trace: "+err.message);});
                req.flash("success", i18n.__("succefully updated your logo"));
                res.redirect("/view/profile/");
            });
        } else {
            logger.warning.log("[WARNING]: file type unknown for uploaded file by User "+req.session.email);
            req.flash("danger", i18n.__("Wrong filetype"));
            res.redirect("/upload/logo");
        }
    } catch (error) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/uploadController.uploadLogoPost on catch block trace: "+err.message);
        req.flash('danger',i18n.__("Something happend, please try again"));
        res.redirect("/upload/logo");
    }
    res.redirect("/view/profile/");
};