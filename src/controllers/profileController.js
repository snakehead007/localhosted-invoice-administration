const Profile = require("../models/profile");
const Settings = require("../models/settings");
const User = require("../models/user");
const i18n = require("i18n");
const {findOneHasError, updateOneHasError} = require("../middlewares/error");
const {getFullNr} = require('../utils/invoices');
const {sendMessage} = require('../../messages/messages');
const {formatBEVat,formatBEBic,formatBEIban,valueMustBeValidBic, valueMustBeValidIban, valueMustBeStreetNumber, valueMustBeAName, valueMustBeEmail, numberMustPhoneNumber, valueMustBeVatNumber, valueMustBePostalCode} = require("../utils/formValidation");
const activity = require('../utils/activity');
const logger = require("../middlewares/logger");
const {getReformatedImageSize} = require("../utils/utils");
const path = require("path");
const sizeOf = require('image-size');
/**
 * @api {get} /view/profile viewProfileGet
 * @apiVersion 3.0.0
 * @apiDescription On this page you can edit all the profile information
 * and shows the current logo picture
 * @apiName viewProfileGet
 * @apiGroup ViewRouter
 * @apiSuccessExample Success-Response:
 *  res.render("edit/edit-profile", {
        "currentUrl": "edit-profile",
        "profile": profile,
        "settings": settings,
        "title": title,
        "role": role
    });
 */
exports.viewProfileGet = async (req, res) => {
    let role = (await User.findOne({_id: req.session._id}, (err, user) => {
        return user
    })).role;
    let title = i18n.__((role === "visitor") ? "Create a new profile" : "Edit");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.viewProfileGet on method Settings.findOne trace: "+err.message);
        if (!err) {
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.viewProfileGet on method Profile.findOne trace: "+err.message);
                let size;
                try{
                    let _path = path.resolve(__dirname,"../../public/images/"+req.session._id+"/logo.jpeg");
                    size = sizeOf(_path);
                }catch(err){
                    console.trace(err);
                }
                size = getReformatedImageSize(size);
                if (!err) {
                    res.render("edit/edit-profile", {
                        "currentUrl": "edit-profile",
                        "profile": profile,
                        "settings": settings,
                        "title": title,
                        "role": role,
                        "size":size
                    });
                }
            });
        }
    });
};

/**
 * @api {get} /edit/profile editProfileGet
 * @apiName editProfileGet
 * @apiVersion 3.0.0
 * @apiDescription this will redirect to editProfileGet
 * @apiGroup EditRouter
 * @apiSuccessExample Success-Response:
 * res.redirect("/view/profile");
 */
exports.editProfileGet = (req, res) => {
    logger.warning.log("[WARNING]: Email:\'"+req.session.email+"\' used profileController.editProfileGet method, this should not happen, redirected to /view/profile");
    res.redirect("/view/profile");
};
/**
 * @api {post} /edit/profile editProfilePost
 * @apiVersion 3.0.0
 * @apiName editProfilePost
 * @apiDescription The profile will be updated with all its given parameters in the form
 * Afterwards will be redirected to /view/profile
 * @apiGroup EditRouter
 * @apiSuccessExample Success-Response:
 *  res.redirect("/view/profile");
*  @apiErrorExample Error-Respone:
 *  res.render("edit/edit-profile", {
                    "currentUrl": "edit-profile",
                    "profile": {
                        "firm": req.body.firm,
                        "name": req.body.name,
                        "street": req.body.street,
                        "streetNr": req.body.streetNr,
                        "postal": req.body.postal,
                        "place": req.body.place,
                        "vat": req.body.vat,
                        "iban": req.body.iban,
                        "bic": req.body.bic,
                        "tel": req.body.tel,
                        "email":  req.body.email,
                        "_id": req.params.idp,
                        "fromUser":req.session._id
                    },
                    "settings": settings,
                    "title": title,
                    "role": role
                });
 */
exports.editProfilePost = async (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is trying to edit its profile with "+JSON.stringify(req.body));
    let firmCheck =  valueMustBeAName(req, res, req.body.firm, false, "firm is invalid");
    let nameCheck = valueMustBeAName(req, res, req.body.name, true, "name is invalid");
    let streetCheck = valueMustBeAName(req, res, req.body.street, false, "street name is invalid");
    let placeCheck = valueMustBeAName(req, res, req.body.place, false, "place name is invalid");
    let emailCheck = valueMustBeEmail(req, res, req.body.email, false, "email address is invalid");
    let telCheck = numberMustPhoneNumber(req, res, req.body.tel);
    let vatCheck = (req.body.vat)?valueMustBeVatNumber(req, res, req.body.vat, false, "nl-BE","VAT number is invalid"):false;
    let ibanCheck = (req.body.iban)?valueMustBeValidIban(req, res, req.body.iban):false;
    let bicCheck = (req.body.bic)? valueMustBeValidBic(req, res, req.body.bic):false;
    let postalCheck = valueMustBePostalCode(req, res, req.body.postal);
    let streetNrCheck = valueMustBeStreetNumber(req, res, req.body.streetNr);
    if (firmCheck || nameCheck || streetCheck || placeCheck || emailCheck || telCheck || vatCheck || postalCheck || streetCheck || bicCheck || ibanCheck || streetNrCheck) {
        log.info("[INFO]: Email:\'"+req.session.email+"\' could not edit profile, due to validation.");
        let role = (await User.findOne({_id: req.session._id}, (err, user) => {
            return user
        })).role;
        let title = i18n.__((role === "visitor") ? "Create a new profile" : "Edit");
        Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.editProfilePost on method Settings.findOne trace: "+err.message);
            if (!err) {
                res.render("edit/edit-profile", {
                    "currentUrl": "edit-profile",
                    "profile": {
                        "firm": req.body.firm,
                        "name": req.body.name,
                        "street": req.body.street,
                        "streetNr": req.body.streetNr,
                        "postal": req.body.postal,
                        "place": req.body.place,
                        "vat": req.body.vat,
                        "iban": req.body.iban,
                        "bic": req.body.bic,
                        "tel": req.body.tel,
                        "email":  req.body.email,
                        "_id": req.params.idp,
                        "fromUser":req.session._id
                    },
                    "settings": settings,
                    "title": title,
                    "role": role
                });
            }
        });
    } else {
        let updateProfile = {
            firm: req.body.firm,
            name: req.body.name,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postal: req.body.postal,
            place: req.body.place,
            vat: (req.body.vat)?formatBEVat(req.body.vat):"",
            iban: (req.body.iban)?formatBEIban(req.body.iban):"",
            bic: (req.body.bic)?formatBEBic(req.body.bic):"",
            tel: req.body.tel,
            email:  req.body.email
        };
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' met validations to edit profile, new profile is"+JSON.stringify(updateProfile));
        Profile.updateOne({fromUser: req.session._id, _id: req.params.idp}, updateProfile, async (err) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.editProfilePost on method Profile.updateOne trace: "+err.message);
            if (!err) {
                let user = await User.findOne({_id: req.session._id}, (err, user) => {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.editProfilePost on method User.findOne trace: "+err.message);
                    if (findOneHasError(req, res, err, user)) {
                        if(err) console.trace(err);
                        return user;
                    }
                });
                if (user.role === "visitor") {
                    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' succesfully updated its role to 'user'");
                    await User.updateOne({_id: req.session._id}, {role: "user"}, (err) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/profileController.editProfilePost on method User.updateOne trace: "+err.message);
                        req.flash("success", i18n.__("successfully created your profile"));
                        res.redirect("/view/profile");
                    });
                } else {
                    activity.editedProfile(updateProfile,req.session._id);
                    req.flash("success", i18n.__("successfully updated your profile"));
                    res.redirect("/view/profile");
                }
            }
        });
    }
};