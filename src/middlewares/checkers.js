const logoutController = require('../controllers/logoutController');
const Settings = require('../models/settings');
const i18n = require('i18n');

/**
 * @apiVersion 3.0.0
 * @apiDefine stillSignedInCheck session checker for sign in
 * checks if you are still signed and the session still exists
 * @apiGroup Middleware
 */
exports.stillSignedInCheck = (req, res, next) => {
    if (!req.session._id) {
        return logoutController.logoutGet(req, res);
    }
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (err) {
            console.trace(err);
            req.flash('danger', "couldn't find user");
            req.redirect('/');
        }
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
};