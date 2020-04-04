const Profile = require("../models/profile");
const Settings = require("../models/settings");
const i18n = require("i18n");
const User = require("../models/user");
const activity = require('../utils/activity');
const logger = require("../middlewares/logger");
const Error = require('../middlewares/error');
/**
 * @api {get} /settings settingsAllGet
 * @apiVersion 3.0.0
 * @apiName settingsAllGet
 * @apiDescription Renders the main settings view
 * where the user can edit there theme, footnotes and vat
 * @apiGroup SettingsRouter
 * @apiSuccessExample Success-Response:
 *  res.render("settings", {
                "currentUrl": "settings",
                "settings": settings,
                "description": "Settings",
                "profile": profile,
                "role": role
            });
 */
exports.settingsAllGet = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        Error.handler(req,res,err,'ES0000');
        Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
            Error.handler(req,res,err,'ES0001');
            res.render("settings", {
                "currentUrl": "settings",
                "settings": settings,
                "description": "Settings",
                "profile": profile,
                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                    Error.handler(req,res,err,'ES0002');
                    return user;
                })).role
            });
        });
    });
};

/**
 * @api {get} /settings/change/lang/:lang settingsChangeLangGet
 * @apiVersion 3.0.0
 * @apiName settingsChangeLangGet
 * @apiDescription Changes the settings locale to the chosen language
 * Also changes the locals and locale session to the chosen language
 * Afterwards redirects to /settings
 * @apiGroup SettingsRouter
 * @apiSuccessExample Success-Response:
 *  res.redirect("/settings");
 */
exports.settingsChangeLangGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' updated their language to "+req.params.lang);
    Settings.updateOne({fromUser: req.session._id}, {locale: req.params.lang}, function (err) {
        Error.handler(req,res,err,'ES0100');
        req.locale = req.params.lang;
        i18n.setLocale(req, req.params.lang);
        i18n.setLocale(res, req.params.lang);
        req.setLocale(req.params.lang);
        res.locals.language = req.params.lang;
        activity.changedLanguage(req.params.lang,req.session._id);
        res.redirect("/settings");
    });
};
/**
 * @api {get} /settings/change/theme/:theme settingsChangeThemeGet
 * @apiVersion 3.0.0
 * @apiName settingsChangeThemeGet
 * @apiDescription Updates the theme in the settings of the current user
 * afterwards redirects to /settings
 * @apiGroup SettingsRouter
 * @apiSuccessExample Success-Response:
 *  res.redirect("/settings")
 */
exports.settingsChangeThemeGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' updated their theme to "+req.params.theme);
    Settings.updateOne({fromUser: req.session._id}, {theme: req.params.theme}, function (err) {
        Error.handler(req,res,err,'ES0200');
        activity.changedTheme(req.params.theme,req.session._id);
        res.redirect("/settings");
    });

};
/**
 * @api {get} /settings/change/text changeTextGet
 * @apiVersion 3.0.0
 * @apiName changeTextGet
 * @apiDescription Updates the settings invoiceText, creditText and offerText of the current user
 * aftwards redirects to /settings
 * @apiGroup SettingsRouter
 * @apiSuccessExample Success-Response:
 *  res.redirect("/settings");
 */
exports.changeTextGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' updated their footer texts with "+JSON.stringify(req.body));
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'ES0300');
        if (!err) {
            let updateSettings = {
                invoiceText: String(req.body.invoiceText),
                creditText: String(req.body.creditText),
                offerText: String(req.body.offerText)
            };
            Settings.updateOne({fromUser: req.session._id, _id: settings._id}, updateSettings, function (err) {
                Error.handler(req,res,err,'ES0400');
                res.redirect("/settings");
            });
        }
    });
};

exports.changePdfOptions = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' updated their pdf options with "+JSON.stringify(req.body));
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'ES0400');
        let pdfnew = {
            titleSize:(req.body.titleSize)?req.body.titleSize:settings.pdf.titleSize,
            noLogo:(req.body.noLogo==="switch"),
            color:req.body.color
        };
        if (!err) {
            Settings.updateOne({fromUser: req.session._id, _id: settings._id}, {pdf:pdfnew}, function (err) {
                Error.handler(req,res,err,'ES0401');
                req.flash('success',i18n.__("Your settings have been updated"));
                res.redirect("/settings");
            });
        }
    });
};

exports.changeBaseconeMail = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' updated their BaseconeMail with "+JSON.stringify(req.body));
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'ES0500');
        if (!err) {
            Settings.updateOne({fromUser: req.session._id, _id: settings._id}, {baseconeMail:req.body.baseconeMail}, function (err) {
                Error.handler(req,res,err,'ES0501');
                req.flash('success',i18n.__("Your settings have been updated"));
                res.redirect("/settings");
            });
        }
    });
};
