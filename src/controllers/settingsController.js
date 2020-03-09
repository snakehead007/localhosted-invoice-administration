const Profile = require("../models/profile");
const Settings = require("../models/settings");
const i18n = require("i18n");
const User = require("../models/user");
const activity = require('../utils/activity');
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
        if (err) {
            console.trace();
        }
        Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
            if (err) {
                console.trace();
            }
            res.render("settings", {
                "currentUrl": "settings",
                "settings": settings,
                "description": "Settings",
                "profile": profile,
                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
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
    Settings.updateOne({fromUser: req.session._id}, {locale: req.params.lang}, function (err) {
        if (err) {
            console.trace(err);
        }
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
    Settings.updateOne({fromUser: req.session._id}, {theme: req.params.theme}, function (err) {
        if (err) {
            console.trace(err);
        }
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
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (!err) {
            let updateSettings = {
                invoiceText: String(req.body.invoiceText),
                creditText: String(req.body.creditText),
                offerText: String(req.body.offerText)
            };
            Settings.updateOne({fromUser: req.session._id, _id: settings._id}, updateSettings, function (err) {
                res.redirect("/settings");
            });
        }
    });
};

exports.changePdfOptions = (req, res) => {
    console.log(req.body);
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        let pdfnew = {
            titleSize:(req.body.titleSize)?req.body.titleSize:settings.pdf.titleSize,
            noLogo:(req.body.noLogo==="switch")
        };
        if (!err) {
            Settings.updateOne({fromUser: req.session._id, _id: settings._id}, {pdf:pdfnew}, function (err) {
                if(err)console.trace(err);
                req.flash('success',i18n.__("Your settings have been updated"));
                res.redirect("/settings");
            });
        }
    });
};