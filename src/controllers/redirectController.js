/**
 * This modules handles redirecting from google and settings locale
 * @module ccntrollers/redirectController
 * @file controllers/redirectControllers
 */

//Local modules
const {getGoogleAccountFromCode} = require('../middlewares/google');
const logger = require("../middlewares/logger");

const Profile = require('../models/profile');
const User = require('../models/user');
const Whitelist = require('../models/whitelist');
const {checkSignIn} = require('../middlewares/google');

const mailgun = require('../utils/mailgun');
const {getIp} = require("../utils/utils");

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
    if(googleCode==='error'){
        req.flash('danger','Error: invalid grant');
        res.redirect('back');
        return;
    }
    logger.info.log("[INFO]: Succesfully got user's google login information: "+JSON.stringify(googleCode));
    console.log(googleCode);
    req.session.email = googleCode.email;
    req.session.googleId = googleCode.googleId;
    req.session.tokens = googleCode.tokens;
    next();
};


exports.checkWhitelistGet = async (req, res) => {
    let found = false;
    let BreakException = {};
    await Whitelist.find({}, async (err, whitelistUsers) => {
        if (err) {
            logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method Profile.findOne trace: "+err.message);
            res.flash('danger', 'Something happen, try again');
        } else {
            try{
                await whitelistUsers.forEach(o => {
                    console.log(req.session.email+" ? "+o.mail);
                    if (req.session.email === o.mail) {
                        console.log('found');
                        throw BreakException;
                    }
                });
            }catch(err){
                if(err === BreakException) {
                    await checkSignIn(req);
                    User.updateOne({_id: req.session._id}, {lastLogin: Date.now()}, async (err) => {
                        if (err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method User.updateOne trace: " + err.message);
                        await Profile.findOne({fromUser: req.session._id}, async function (err, profile) {
                            if (err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method Profile.findOne trace: " + err.message);
                            if (profile === null) {
                                const newProfile = new Profile({
                                    fromUser: req.session._id
                                });
                                await newProfile.save();
                                profile = await Profile.findOne({fromUser: req.session._id});
                                await User.updateOne({_id: req.session._id}, {profile: profile._Id});
                            }
                        });
                        if (err) console.trace(err);
                        let user = await User.findOne({_id: req.session._id}, (err, user) => {
                            if (err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method User.findOne trace: " + err.message);
                            return user
                        });
                        if (user.isBlocked) {
                            req.session.regenerate(function (err) {
                                if (err) {
                                    console.trace(err);
                                } else {

                                }
                                req.flash('warning', 'You are blocked from the site, please contact us if this was a mistake');
                                res.redirect('/');
                            });
                        } else {
                            req.session.role = user.role;
                            if (user.role === "visitor") {
                                mailgun.sendWelcome(req.session.email);
                                res.redirect('/view/profile');
                            } else {
                                res.redirect('/dashboard');
                            }
                        }
                    });
                    return;
                }else{
                    req.flash('danger','Something went wrong please try again');
                    res.redirect('/');
                    return;
                }
            }
            req.flash('warning', 'You are not whitelisted, please contact the administrator');
            res.redirect('/');
        }
    });
};
