const Profile = require('../models/profile');
const Settings = require('../models/settings');

exports.calc_all_get = (req,res) =>{
    Profile.findOne({},function(err,profile){
        Settings.findOne({}, function(err, settings) {
            res.render('calc', {
                'settings': settings,
                'description': "Settings",
                'profile':profile
            });
        });
    });
};