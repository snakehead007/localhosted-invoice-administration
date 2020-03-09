/**
 * This modules handles redirecting from google and settings locale
 * @module ccntrollers/redirectController
 * @file controllers/redirectControllers
 */

//Installed modules
const i18n = require('i18n');
const User = require('../models/user');
//Local modules
const {getGoogleAccountFromCode, checkSignIn} = require('../middlewares/google');
const Settings = require('../models/settings');
const {findOneHasError, updateOneHasError} = require('../middlewares/error');
const logger = require("../middlewares/logger");


/**
 * @apiVersion 3.0.0
 * @api {get} /redirect/ googleLogin
 * @apiParam {String} [field] unique id the user
 * @apiParamExample {String} title:
 "id": client._id
 * @apiDescription this will use the {@link src/middlewares/google|Google middleware} to decrypt to OAuth2 login information of the user
 * @apiName getClientAll
 * @apiGroup RedirectRouter
 */
exports.googleLogin = async (req, res, next) => {
    logger.info.log("[INFO]: got redirection url from google succesfully");
    let googleCode = await getGoogleAccountFromCode(req.query.code);
    logger.info.log("[INFO]: Succesfully got user's google login information: "+JSON.stringify(googleCode));
    const userInfo = await checkSignIn(req, googleCode);
    req.session.loggedIn = userInfo;
    req.session._id = userInfo._id;
    req.session.role = await User.findOne({_id: userInfo._id}, (err, user) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectController.googleLogin on method User.findOne trace: "+err.message);
        if (findOneHasError(req, res, err, user)) {
            return user.role;
        }
    });
    Settings.findOne({fromUser: userInfo._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectController.googleLogin on method Settings.findOne trace: "+err.message);
        next();
    });
};

