const logoutController = require('../controllers/logoutController');
const Settings = require('../models/settings');
const i18n = require('i18n');
exports.stillSignedInCheck = (req,res,next) => {
    if(!req.session._id){
        console.log("[Warning]: not logged in anymore, destroying session & redirect to login");
        return logoutController.logout_get(req,res);
    }
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
} ;