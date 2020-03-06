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

/**
 * This will use the {@link src/middlewares/google|Google middleware} to decrypt to OAuth2 login information of the user
 * @alias module:src/controllers/redirectController.googleLogin
 * @param req {Object} request - request of express
 * @param res {Object} response - response of express
 * @param next {Object} next - links to the next function in line
 * @returns {Promise<void>}
 * @exports src/controllers/redirectController.googleLogin
 */

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
    const userInfo = await checkSignIn(req, await getGoogleAccountFromCode(req.query.code));
    req.session.loggedIn = userInfo;
    req.session._id = userInfo._id;
    req.session.role = await User.findOne({_id: userInfo._id}, (err, user) => {
        if (findOneHasError(req, res, err, user)) {
            return user.role;
        }
    });
    Settings.findOne({fromUser: userInfo._id}, function (err, settings) {
        if (err) console.trace();
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
};