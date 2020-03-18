/**
 * This modules handles redirecting from google and settings locale
 * @module ccntrollers/redirectController
 * @file controllers/redirectControllers
 */

//Local modules
const {getGoogleAccountFromCode} = require('../middlewares/google');
const logger = require("../middlewares/logger");


/**
 * @apiVersion 3.0.0
 * @api {get} /redirect/ googleLogin
 * @apiParam {String} [field] unique id the user
 * @apiParamExample {String} title:
 "id": client._id
 * @apiDescription this will use the src/middlewares/google to decrypt to OAuth2 login information of the user
 * @apiName getClientAll
 * @apiGroup RedirectRouter
 */
exports.googleLogin = async (req, res, next) => {
    logger.info.log("[INFO]: got redirection url from google succesfully");
    let googleCode = await getGoogleAccountFromCode(req.query.code);
    logger.info.log("[INFO]: Succesfully got user's google login information: "+JSON.stringify(googleCode));
    req.session.email = googleCode.email;
    req.session.googleId = googleCode.googleId;
    req.session.tokens = googleCode.tokens;
    next();
};

