const Settings = require('../models/settings');
const Profile = require('../models/profile');
const fs = require('fs');
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

exports.upload_logo_post = async (req,res) => {
    try {
        if (Object.keys(req.files).length === 0) // TODO: THIS CHECK DOESNT WORK
            return res.status(400).send('No files were uploaded.');
        let logoFile = req.files.logoFile;
        console.log("[Info]: Upload logo "+logoFile.name+" from "+req.session._id);
        Profile.findOne({fromUser:req.session._id},async function(err,profile){
            let url = 'public/images' + req.session._id + '/logo.jpeg';
            if (!fs.existsSync('public/images' + req.session._id)) {
                await fs.mkdirSync('public/images' + req.session._id);
                await logoFile.mv(url);
                profile.logoFile.data = fs.readFileSync(url);
                profile.logoFile.contentType = 'image/jpeg';
                await profile.save();
                res.redirect('/view/profile/');
            }

        });
    }catch(error){
        console.trace(error);
        res.redirect('/view/profile');
    }
};