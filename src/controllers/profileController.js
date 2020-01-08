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