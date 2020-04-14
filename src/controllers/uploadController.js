const Settings = require("../models/settings");
const User = require("../models/user");
const Profile = require("../models/profile");
const fs = require("fs");
const logger = require("../middlewares/logger");
const i18n = require("i18n");
const Error = require('../middlewares/error');
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
        Error.handler(req,res,err,'FU0000');
        Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
            Error.handler(req,res,err,'FU0001');
            res.render("upload", {
                "settings": settings,
                "description": "Upload logo",
                "profile": profile,
                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                    Error.handler(req,res,err,'FU0002');
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
        console.log(req.files);
        let logoFile = req.files.logoFile;
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is trying to upload logo file of mimetype "+req.files.logoFile.mimetype);
        if (logoFile.mimetype === "image/jpeg" || logoFile.mimetype === "image/jpg" || !logoFile.mimetype) {
            Profile.findOne({fromUser: req.session._id}, async function (err, profile) {
                Error.handler(req,res,err,'FU0100');
                let url = "public/images/" + req.session._id + "/logo.jpeg";
                if (!fs.existsSync("public/images/" + req.session._id)) {
                    await fs.mkdirSync("public/images/" + req.session._id);
                }
                await logoFile.mv(url);
                profile.logoFile.data = fs.readFileSync(url);
                profile.logoFile.contentType = "image/jpeg";
                await profile.save((err)=>{
                    Error.handler(req,res,err,'FU0101');});
                req.flash("success", i18n.__("succefully updated your logo"));
                res.redirect("/view/profile/");
                return;
            });
        } else {
            logger.warning.log("[WARNING]: file type unknown for uploaded file by User "+req.session.email);
            req.flash("danger", i18n.__("Wrong filetype"));
            res.redirect("/upload/logo");
            return;
        }
    } catch (error) {
        Error.handler(req,res,error,'FU0102');
        req.flash('danger',i18n.__("Something happend, please try again"));
        res.redirect("/upload/logo");
        return;
    }
    res.redirect("/view/profile/");
};