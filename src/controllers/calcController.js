const Profile = require('../models/profile');
const Settings = require('../models/settings');

exports.calc_all_get = (req,res) =>{
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        Settings.findOne({fromUser:req.session._id}, function(err, settings) {
            res.render('calc', {
                'currentUrl':'calc',
                'settings': settings,
                'description': "Settings",
                'profile':profile
            });
        });
    });
};