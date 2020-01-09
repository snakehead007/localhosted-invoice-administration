const Settings = require('../models/settings');
const Profile = require('../models/profile');

exports.upload_logo_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            res.render('upload',{
                "settings":settings,
                "description":"Upload logo",
                "profile":profile
            });
        });
    });
};

exports.upload_logo_post = (req,res) => {
    if (Object.keys(req.files).length === 0) // TODO: THIS CHECK DOESNT WORK
        return res.status(400).send('No files were uploaded.');
    let sampleFile = req.files.sampleFile;
    console.log(sampleFile);
    sampleFile.mv('public/logo.jpeg', function(err) {
        if(err) console.log("[ERROR]: "+err);
        res.redirect('/view/profile/');
    });
};