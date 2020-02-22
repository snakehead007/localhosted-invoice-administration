const Profile = require("../models/profile");
const Settings = require("../models/settings");
const i18n = require("i18n");
const User = require("../models/user");

/**
 * @api {get} /settings settings_all_get
 * @apiName settings_all_get
 * @apiDescription Renders the main settings view
 * where the user can edit there theme, footnotes and vat
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        "currentUrl": "settings",
        "settings": settings,
        "description": "Settings",
        "profile":profile
    }
 */
exports.settings_all_get = (req, res) => {
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
 * @api {get} /settings/change/lang/:lang settings_change_lang_Get
 * @apiName settings_change_lang_get
 * @apiDescription Changes the settings locale to the chosen language
 * Also changes the locals and locale session to the chosen language
 * Afterwards redirects to /settings
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
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
        res.redirect("/settings");
    });
};
/**
 * @api {get} /settings/change/theme/:theme settings_change_theme_get
 * @apiName settings_change_theme_get
 * @apiDescription Updates the theme in the settings of the current user
 * afterwards redirects to /settings
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
exports.settingsChangeThemeGet = (req, res) => {
    Settings.updateOne({fromUser: req.session._id}, {theme: req.params.theme}, function (err) {
        if (err) {
            console.trace(err);
        }
        res.redirect("/settings");
    });

};
/**
 * @api {get} /settings/change/text change_text_post
 * @apiName change_text_post
 * @apiDescription Updates the settings invoiceText, creditText and offerText of the current user
 * aftwards redirects to /settings
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
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