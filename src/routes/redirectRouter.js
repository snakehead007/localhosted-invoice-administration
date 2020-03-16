/**
 * Handles redirections from google login
 * @module routes/redirectRouter
 * @file routes/redirectRouter
 */

//installed modules
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Profile = require('../models/profile');

//Local modules
const User = require('../models/user');
const redirectController = require('../controllers/redirectController');
const Whitelist = require('../models/whitelist');
const activity = require('../utils/activity');
const mailgun = require('../utils/mailgun');
const geoip = require('geoip-lite');
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
    /*if(process.env.DEVELOP==="false") {
        try{
        let ip = getIp(req);
        let geo = geoip.lookup(ip);
        if(geo.country!=="BE"){
            found = false;
            logger.warning.log("[WARNING]: Not from GEO-location BE, ip "+ip+" redirecting back");
        }
        }catch(err){
            logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on catch block trace: "+err.message);
            req.flash('danger',"Something went wrong, please try again. Or contact us");
            res.redirect('/');
            return;
        }
    }*/
    if (found) {
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
            let role = (await User.findOne({_id: req.session._id}, (err, user) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/redirectRouter.router.get('/') on method User.findOne trace: "+err.message);
                return user
            })).role;
            req.session.role = role;
            if (role === "visitor") {
                mailgun.sendWelcome(req.session.email);
                res.redirect('/view/profile');
            } else {
                res.redirect('/dashboard');
            }

        });
    } else {
        req.flash('warning', 'You are not whitelisted, please contact the administrator');
        res.redirect('/');
    }
});

module.exports = router;