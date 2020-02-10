/**
 * @module controller/logoutController
 */

/**
 *
 * @param req
 * @param res
 */
const i18n = require('i18n');
exports.logout_get = (req,res) => {
    req.session.regenerate(function(err) {
        //new empty session
        req.flash('success',i18n.__('Successfully logged out'));
        console.log(req.session);
        if(err) {
            return console.log(err);
        }
        res.render('login');
    })
};