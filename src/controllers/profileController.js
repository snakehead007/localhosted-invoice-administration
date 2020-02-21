const Profile = require("../models/profile");
const Settings = require("../models/settings");
const User = require("../models/user");
const i18n = require("i18n");
const {findOneHasError,updateOneHasError} = require("../middlewares/error");
const {getFullNr}  = require('../utils/invoices');
const { valueMustBeValidBic,valueMustBeValidIban,valueMustBeStreetNumber,valueMustBeAName,valueMustBeEmail,numberMustPhoneNumber, valueMustBeVatNumber, valueMustBePostalCode} = require("../utils/formValidation");
/**
 * @api {get} /view/profile view_profile_get
 * @apiDescription On this page you can edit all the profile information
 * and shows the current logo picture
 * @apiName view_profile_get
 * @apiGroup View
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "currentUrl":"edit-profile",
        "profile": profile,
        "offerNrCurrent": Number(jaar + nroff_str),
        "invoiceNrCurrent": Number(jaar + nr_str),
        "creditNrCurrent": Number(jaar + nrcred_str),
        "settings": settings
 *  }
 */
exports.viewProfileGet = (req,res) => {
    let date = new Date();
    let _jaar = date.getFullYear();
    let jaar = _jaar.toString();
    Profile.findOne({fromUser:req.session._id}, async (err, profile) => {
        if (!err) {
            let invoiceNr = getFullNr(profile.invoiceNrCurrent);
            let offerNr = getFullNr(profile.offerNrCurrent);
            let creditNr = getFullNr(profile.creditNrCurrent);
            let role = (await User.findOne({_id:req.session._id},(err,user)=> {return user})).role;
            let title = i18n.__((role==="visitor")?"Create a new profile":"Edit");
            console.log(role);
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if (!err) {
                    Profile.findOne({fromUser:req.session._id}, async(err, profile) =>{
                        if (!err) {
                            res.render("edit/edit-profile", {
                                "currentUrl":"edit-profile",
                                "profile": profile,
                                "offerNrCurrent": offerNr,
                                "invoiceNrCurrent": invoiceNr,
                                "creditNrCurrent": creditNr,
                                "settings": settings,
                                "title":title,
                                "role":(await User.findOne({_id:req.session._id},(err,user)=> {return user})).role
                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 * @api {get} /edit/profile edit_profile_get
 * @apiName edit_profile_get
 * @apiDescription this will redirect to view_profile_get
 * @apiGroup Edit
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
exports.editProfileGet = (req,res) => {
    res.redirect("/view/profile");
};
/**
 * @api {post} /edit/profile edit_profile_post
 * @apiName edit_profile_post
 * @apiDescription The profile will be updated with all its given parameters in the form
 * Afterwards will be redirected to /view/profile
 * @apiGroup Edit
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
exports.editProfilePost = (req,res) => {
    let firmCheck = valueMustBeAName(req,res,req.body.firm,false,"firm is invalid");
    let nameCheck = valueMustBeAName(req,res,req.body.name,true,"name is invalid");
    let streetCheck = valueMustBeAName(req,res,req.body.street,false,"street name is invalid");
    let placeCheck = valueMustBeAName(req,res,req.body.place,false,"place name is invalid");
    let emailCheck = valueMustBeEmail(req,res,req.body.email,false,"email address is invalid");
    let telCheck = numberMustPhoneNumber(req,res,req.body.tel);
    let vatCheck = valueMustBeVatNumber(req,res,req.body.vat.trim(),false,"VAT number is invalid");
    let ibanCheck = valueMustBeValidIban(req,res,req.body.iban.trim());
    let bicCheck = valueMustBeValidBic(req,res,req.body.bic.trim());
    let postalCheck = valueMustBePostalCode(req,res,req.body.postal);
    let streetNrCheck = valueMustBeStreetNumber(req,res,req.body.streetNr);
    if(firmCheck||nameCheck||streetCheck||placeCheck||emailCheck||telCheck||vatCheck||postalCheck||streetCheck||bicCheck||ibanCheck||streetNrCheck) {
        res.redirect("/view/profile");
    } else {
        let updateProfile = {
            firm: req.body.firm,
            name: req.body.name,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postal: req.body.postal,
            place: req.body.place,
            vat: req.body.vat,
            iban: req.body.iban,
            bic: req.body.bic,
            /*
            invoiceNrCurrent: Number(req.body.invoiceNrCurrent.toString().substring(req.body.invoiceNrCurrent.toString().length - 3)),
            offerNrCurrent: Number(req.body.offerNrCurrent.toString().substring(req.body.offerNrCurrent.toString().length - 3)),
            creditNrCurrent: Number(req.body.creditNrCurrent.toString().substring(req.body.creditNrCurrent.toString().length - 3)),
             */
            tel: req.body.tel,
            email: [req.body.email]
        };
        Profile.updateOne({fromUser: req.session._id, _id: req.params.idp}, updateProfile, async (err) => {
            if (!err) {
                let user = await User.findOne({_id:req.session._id},(err,user)=> {
                    if(findOneHasError(req,res,err,user)){
                           return user;
                    }
                });
                if(user.role==="visitor") {
                   await User.updateOne({_id: req.session._id}, {role: "user"}, (err) => {
                        req.flash("success", "successfully updated your profile");
                        res.redirect("/view/profile");
                    });
                }else{
                    req.flash("success", "successfully updated your profile");
                    res.redirect("/view/profile");
                }
            }
        });
    }
};