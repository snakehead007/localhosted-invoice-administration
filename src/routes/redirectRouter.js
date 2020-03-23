/**
 * Handles redirections from google login
 * @module routes/redirectRouter
 * @file routes/redirectRouter
 */

//installed modules
const express = require("express");
const router = express.Router();
const Profile = require('../models/profile');

//Local modules
const User = require('../models/user');
const redirectController = require('../controllers/redirectController');
const Whitelist = require('../models/whitelist');
const {checkSignIn} = require('../middlewares/google');
const mailgun = require('../utils/mailgun');
const logger = require("../middlewares/logger");
const {getIp} = require("../utils/utils");
//Get requests
/**
 * @apiVersion 3.0.0
 * @api {get} /redirect/ redirectGoogleLogin
 * @apiParam {String} [field] unique id the user
 * @apiParamExample {String} title:
 "id": client._id
 * @apiDescription Shows all clients of the user
 * @apiName redirectGoogleLogin
 * @apiGroup Redirect
 * @apiSuccessExample Success-Example when not in the whitelist:
     req.flash('warning', 'You are not whitelisted, please contact the administrator');
     res.redirect('/');
 */
router.get('/', redirectController.googleLogin, async (req, res) => {
    let found = false;
    await Whitelist.find({}, async (err, whitelistUsers) => {
        if (err) {
            logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method Profile.findOne trace: "+err.message);
            res.flash('danger', 'Something happen, try again');
        } else {
            await whitelistUsers.forEach(o => {
                if (req.session.email === o.mail) {
                    found = true;
                }
            });
        }
    });
    if(!found){
        logger.warning.log("[WARNING]: Not found in whitelist, ip "+getIp(req)+" redirecting back");
    }
    if (found) {
        await checkSignIn(req);
        User.updateOne({_id: req.session._id}, {lastLogin: Date.now()}, async (err) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method User.updateOne trace: "+err.message);
            await Profile.findOne({fromUser: req.session._id}, async function (err, profile) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method Profile.findOne trace: "+err.message);
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
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method User.findOne trace: "+err.message);
                return user
            });
            req.session.role = user.role;
            if (user.role === "visitor") {
                mailgun.sendWelcome(req.session.email);
                res.redirect('/view/profile');
            } else {
                res.redirect('/dashboard');
            }
        });
        return;
    }
    if(!found){
        req.flash('warning', 'You are not whitelisted, please contact the administrator');
        res.redirect('/');
    }
});

module.exports = router;