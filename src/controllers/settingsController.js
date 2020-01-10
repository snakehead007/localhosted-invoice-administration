const Profile = require('../models/profile');
const Settings = require('../models/settings');
const i18n = require('i18n');
exports.settings_all_get = (req,res) =>{
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        if(err) console.trace();
        Settings.findOne({fromUser:req.session._id}, function(err, settings) {
            if(err) console.trace();
            res.render('settings', {
                'currentUrl': 'settings',
                'settings': settings,
                'description': "Settings",
                'profile':profile
            });
        });
    });
};

exports.settings_change_lang_get = (req,res) => {
    Settings.updateOne({fromUser:req.session._id},{lang:req.params.lang},function(err){
        if(err) console.trace();
        req.locale = req.params.lang;
        i18n.setLocale(req, req.params.lang);
        i18n.setLocale(res, req.params.lang);
        req.setLocale(req.params.lang);
        res.locals.language = req.params.lang;
        res.redirect('/settings');
    });
};

exports.change_text_post = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if (!err) {
            let updateSettings = {
                invoiceText: String(req.body.invoiceText),
                creditText: String(req.body.creditText),
                offerText: String(req.body.offerText)
            };
            Settings.updateOne({fromUser:req.session._id,_id: settings._id}, updateSettings, function(err) {
                if(err){console.log('err: '+err);}
                res.redirect('/settings');
            });
        }
    });
};