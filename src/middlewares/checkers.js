const logoutController = require('../controllers/logoutController');
const Settings = require('../models/settings');
const i18n = require('i18n');
const logger = require("./logger");
const {getIp} = require("../utils/utils");
/**
 * @apiVersion 3.0.0
 * @apiDefine stillSignedInCheck session checker for sign in
 * checks if you are still signed and the session still exists
 * @apiGroup Middleware
 */
exports.stillSignedInCheck = (req, res, next) => {
    if (!req.session._id) {
        logger.warning.log("[WARNING]: Session timeout or removed at ip "+getIp(req)+", logging out...");
        return logoutController.logoutGet(req, res);
    }
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (err) {
            logger.error.log("[ERROR]: thrown at /src/middlewares/checkers.stillSignedInCheck on method Settings.findOne trace: "+err.message);
            req.flash('danger', i18n.__("couldn't find user"));
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