const Profile = require('../models/profile');
const Settings = require('../models/settings');
const i18n = require('i18n');
const { valueMustBeValidBic,valueMustBeValidIban,valueMustBeStreetNumber,valueMustBeAName,valueMustBeEmail,numberMustPhoneNumber, valueMustBeVatNumber, valueMustBePostalCode} = require('../utils/formValidation');
/**
 * @api {get} /view/profile view_profile_get
 * @apiDescription On this page you can edit all the profile information
 * and shows the current logo picture
 * @apiName view_profile_get
 * @apiGroup View
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      'currentUrl':"edit-profile",
        'profile': profile,
        'offerNrCurrent': Number(jaar + nroff_str),
        'invoiceNrCurrent': Number(jaar + nr_str),
        'creditNrCurrent': Number(jaar + nrcred_str),
        "settings": settings
 *  }
 */
exports.view_profile_get = (req,res) => {
    let date = new Date();
    let _jaar = date.getFullYear();
    let jaar = _jaar.toString();
    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
        if (!err) {
            var _nr = profile.invoiceNrCurrent;
            var nr_str = _nr.toString();
            if (nr_str.toString().length == 1) {
                nr_str = "00" + _nr.toString();
            } else if (nr_str.toString().length == 2) {
                nr_str = "0" + _nr.toString();
            }
            var _nroff = profile.offerNrCurrent;
            var nroff_str = _nroff.toString();
            if (nroff_str.toString().length == 1) {
                nroff_str = "00" + _nroff.toString();
            } else if (nroff_str.toString().length == 2) {
                nroff_str = "0" + _nroff.toString();
            }
            var _nrcred = profile.creditNrCurrent;
            var nrcred_str = _nrcred.toString();
            if (nrcred_str.toString().length == 1) {
                nrcred_str = "00" + _nrcred.toString();
            } else if (nrcred_str.toString().length == 2) {
                nrcred_str = "0" + _ncred.toString();
            }
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if (!err) {
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if (!err) {
                            res.render('edit/edit-profile', {
                                'currentUrl':"edit-profile",
                                'profile': profile,
                                'offerNrCurrent': Number(jaar + nroff_str),
                                'invoiceNrCurrent': Number(jaar + nr_str),
                                'creditNrCurrent': Number(jaar + nrcred_str),
                                "settings": settings
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
exports.edit_profile_get = (req,res) => {
    res.redirect('/view/profile');
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
exports.edit_profile_post = (req,res) => {
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
        res.redirect('/view/profile');
    } else {
        var updateProfile = {
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
            email: [req.body.email],
            fromUser: req.session._id
        };
        Profile.updateOne({fromUser: req.session._id, _id: req.params.idp}, updateProfile, function (err) {
            if (!err) {
                req.flash('success',"successfully updated your profile");
                res.redirect('/view/profile');
            }
        });
    }
};