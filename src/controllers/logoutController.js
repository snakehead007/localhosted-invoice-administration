/**
 * @module controller/logoutController
 */

/**
 *
 * @param req
 * @param res
 */
const i18n = require("i18n");
exports.logout_get = (req, res) => {
    req.session.regenerate(function (err) {
        //new empty session
        req.flash("success", i18n.__("Successfully logged out"));
        if (err) {
            console.log("[Error]: Got an error on generating session in logout_get");
            if (process.env.LOGGING > 2) {
                console.trace("[Error]: " + err);
            }
        }
        res.redirect("/");
    })
};