const Profile = require('../models/profile');
const Settings = require('../models/settings');

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
                };
            });
        };
    });
};

exports.edit_profile_get = (req,res) => {
    res.redirect('/view/profile');
};

exports.edit_profile_post = (req,res) => {
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
        fromUser:req.session._id
    };
    Profile.update({fromUser:req.session._id,_id: req.params.idp}, updateProfile, function(err) {
        if (!err) {
            res.redirect('/view/profile');
        }
    });
}