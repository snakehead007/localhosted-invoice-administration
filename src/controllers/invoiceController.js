const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Profile = require('../models/profile');
exports.invoice_all_get = (req,res) => {
    Invoice.find({fromUser:req.session._id}, function(err, invoices) {
        if (!err) {
                Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                    if(!err){
                        Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                            if (!err) {
                                res.render('invoices', {
                                    'invoices': invoices,
                                    "profile": profile,
                                    "settings": settings,
                                });
                            }
                        });
                    }
                });
        }
    });
};