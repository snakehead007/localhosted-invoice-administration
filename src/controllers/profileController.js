const Profile = require("../models/profile");
const Settings = require("../models/settings");
const User = require("../models/user");
const i18n = require("i18n");
const {findOneHasError, updateOneHasError} = require("../middlewares/error");
const {getFullNr} = require('../utils/invoices');
const {sendMessage} = require('../../messages/messages');
const {formatBEVat,formatBEBic,formatBEIban,valueMustBeValidBic, valueMustBeValidIban, valueMustBeStreetNumber, valueMustBeAName, valueMustBeEmail, numberMustPhoneNumber, valueMustBeVatNumber, valueMustBePostalCode} = require("../utils/formValidation");
const activity = require('../utils/activity');
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
        if (!err) {
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                if (!err) {
                    res.render("edit/edit-profile", {
                        "currentUrl": "edit-profile",
                        "profile": profile,
                        "settings": settings,
                        "title": title,
                        "role": role
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
        let role = (await User.findOne({_id: req.session._id}, (err, user) => {
            return user
        })).role;
        let title = i18n.__((role === "visitor") ? "Create a new profile" : "Edit");
        Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
            if(err) console.trace(err);
            console.log(settings);
            console.log(title);
            console.log(role);
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
        console.log(updateProfile);
        Profile.updateOne({fromUser: req.session._id, _id: req.params.idp}, updateProfile, async (err) => {
            if(err) console.trace(err);
            if (!err) {
                let user = await User.findOne({_id: req.session._id}, (err, user) => {
                    if (findOneHasError(req, res, err, user)) {
                        if(err) console.trace(err);
                        return user;
                    }
                });
                if (user.role === "visitor") {
                    await User.updateOne({_id: req.session._id}, {role: "user"}, (err) => {
                        if(err) console.trace(err);
                        req.flash("success", "successfully updated your profile");
                        res.redirect("/view/profile");
                    });
                } else {
                    activity.editedProfile(updateProfile,req.session._id);
                    req.flash("success", "successfully updated your profile");
                    res.redirect("/view/profile");
                }
            }
        });
    }
};