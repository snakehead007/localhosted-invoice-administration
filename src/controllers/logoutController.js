/**
 * @module controller/logoutController
 */

const i18n = require("i18n");
const logger = require("../middlewares/logger");
/**
 * @apiVersion 3.0.0
 * @api {get} /logout/ logoutGet
 * @apiDescription Deletes and makes a clean new session, and redirects to the login page
 * @apiName logoutGet
 * @apiGroup LogoutRouter
 * @apiSuccessExample Success-Response:
 *  res.redirect("/");
 */
exports.logoutGet = async (req, res) => {
    let emailofUser = req.session.email;
    req.session.regenerate(function (err) {
        //new empty session
        req.flash("success", i18n.__("Successfully logged out"));
        if (err) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/logoutController.logoutGet on method req.session.regenerate trace: "+err.message);
        }
        if(!err){
            logger.info.log("[INFO]: User "+emailofUser.toString()+" successfully logged out");
        }
        res.redirect("/");
    })
};