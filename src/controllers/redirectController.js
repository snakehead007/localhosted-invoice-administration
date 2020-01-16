const i18n = require('i18n');
const {getGoogleAccountFromCode,checkSignIn} = require('../middlewares/google');
const Settings = require('../models/settings');
exports.googleLogin = async (req,res,next) => {
    const userInfo = await checkSignIn(req,await getGoogleAccountFromCode(req.query.code));
    req.session.loggedIn = userInfo;
    req.session._id = userInfo._id;
    Settings.findOne({fromUser:userInfo._id},function(err,settings){
        if(err) console.trace();
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
};