const Profile = require('../models/profile');
const Settings = require('../models/settings');

exports.view_profile_get = (req,res) => {
    let date = new Date();
    let _jaar = date.getFullYear();
    let jaar = _jaar.toString();
    Profile.findOne({}, function(err, profile) {
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
            Settings.findOne({}, function(err, settings) {
                if (!err) {
                    Profile.findOne({}, function(err, profile) {
                        if (!err) {
                            res.render('edit/edit-profile', {
                                'profile': profile,
                                'nroff': Number(jaar + nroff_str),
                                'nr': Number(jaar + nr_str),
                                'nrcred': Number(jaar + nrcred_str),
                                "profile":profile,
                                "settings": settings
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.edit_profile_get = (req,res) => {
    res.redirect('/view/profile');
};

exports.edit_profile_post = (req,res) => {
    var updateProfile = new Profile({
        firm: req.body.firma,
        name: req.body.naam,
        street: req.body.straat,
        streetNr: req.body.straatNr,
        postal: req.body.postcode,
        place: req.body.plaats,
        vat: req.body.btwNr,
        iban: req.body.iban,
        bic: req.body.bic,
        invoiceNrCurrent: Number(req.body.nr.toString().substring(req.body.nr.toString().length - 3)),
        offerNrCurrent: Number(req.body.nroff.toString().substring(req.body.nroff.toString().length - 3)),
        creditNrCurrent: Number(req.body.nrcred.toString().substring(req.body.nrcred.toString().length - 3)),
        tel: req.body.tele,
        email: [req.body.mail]
    });
    Profile.update({_id: req.params.id}, updateProfile, function(err) {
        if (!err) {
            res.redirect('/dashboard');
        }
    });
}