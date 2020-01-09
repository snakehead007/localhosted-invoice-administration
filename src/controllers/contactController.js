const Profile = require('../models/profile');
const Client = require('../models/client');
const Settings = require('../models/settings');

exports.contact_all_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        Client.find({fromUser:req.session._id}, function(err, clients) {
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if (!err ) {
                    res.render('clients', {
                        'currentUrl':'clients',
                        'clients': clients,
                        "settings": settings,
                        "profile":profile
                    });
                }
            });
        });
    });
};