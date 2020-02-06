const Profile = require('../models/profile');
const Settings = require('../models/settings');
const i18n = require('i18n');
const { valueMustStreetNumber,valueMustBeAName,valueMustBeEmail,numberMustPhoneNumber, valueMustBeVatNumber, valueMustBePostalCode} = require('../utils/formValidation');
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
            console.log(profile);
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
                };
            });
        };
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
    let firmCheck = valueMustBeAName(req.body.firm,"firm is invalid");
    if(firmCheck.invalid)
        req.flash('danger',i18n.__(firmCheck.message));
    let nameCheck = valueMustBeAName(req.body.name,"name is invalid");
    if(nameCheck.invalid)
        req.flash('danger',i18n.__(nameCheck.message));
    let streetCheck = valueMustBeAName(req.body.street,"street name is invalid");
    if(streetCheck.invalid)
        req.flash('danger',i18n.__(streetCheck.message));
    let placeCheck = valueMustBeAName(req.body.place,"place name is invalid");
    if(placeCheck.invalid)
        req.flash('danger',i18n.__(placeCheck.message));
    let emailCheck = valueMustBeEmail(req.body.email,"email address is invalid");
    let emailInvalid = req.body.email!==""&&emailCheck.invalid;
    if(emailInvalid)
        req.flash('danger',i18n.__(emailCheck.message));
    let telCheck = numberMustPhoneNumber(req.body.tel);
    let telInvalid = req.body.tel !==""&&telCheck.invalid;
    if(telInvalid)
        req.flash('danger',i18n.__(telCheck.message));
    let vatCheck = valueMustBeVatNumber(req.body.vat.trim(),"VAT number is invalid");
    console.log(vatCheck);
    let vatInvalid = req.body.vat !== ""&&vatCheck.invalid;
    if(vatInvalid)
        req.flash('danger',i18n.__(vatCheck.message));
    let postalCheck = valueMustBePostalCode(req.body.postal);
    let postalInvalid = req.body.postal !== "" && postalCheck.invalid;
    if(postalInvalid)
        req.flash('danger',i18n.__(postalCheck.message));
    let streetNrCheck = valueMustStreetNumber(req.body.streetNr);
    let streetNrInvalid = req.body.streetNr !== "" && streetCheck.invalid;
    console.log(streetNrInvalid);
    if(streetNrInvalid)
        req.flash('danger',i18n.__(streetNrCheck.message));
    if(firmCheck.invalid||nameCheck.invalid||streetCheck.invalid||placeCheck.invalid||emailInvalid||telInvalid||vatInvalid||postalInvalid||streetNrInvalid) {
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
            invoiceNrCurrent: Number(req.body.invoiceNrCurrent.toString().substring(req.body.invoiceNrCurrent.toString().length - 3)),
            offerNrCurrent: Number(req.body.offerNrCurrent.toString().substring(req.body.offerNrCurrent.toString().length - 3)),
            creditNrCurrent: Number(req.body.creditNrCurrent.toString().substring(req.body.creditNrCurrent.toString().length - 3)),
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
}