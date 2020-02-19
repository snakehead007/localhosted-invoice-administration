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
//Get requests
/**
 * Handles GET /redirect
 * Goes to {@link src/controllers/redirectController.googleLogin|RedirectController.googleLogin} then checks if user.email is in whitelist.
 */
router.get('/' ,redirectController.googleLogin,  async (req,res)=>{
    let found = false;
    await Whitelist.find({},async (err,whitelistUsers) => {
        console.log(whitelistUsers);
        if(err){
            res.flash('danger','Something happen, try again');
        }else{
            await whitelistUsers.forEach(o => {
                if(req.session.email===o.mail){
                    found = true;
                }
            });
        }
    });
    if(found){
        User.updateOne({_id:req.session._id},{lastLogin:Date.now()},async (err) => {
            await Profile.findOne({fromUser:req.session._id}, async function(err,profile) {
                if (profile === null) {
                    console.log("[Error]: Profile not found from user");
                    const newProfile = new Profile({
                        fromUser: req.session._id
                    });
                    await newProfile.save();
                    profile = await Profile.findOne({fromUser: req.session._id});
                    await User.updateOne({_id: req.session._id}, {profile: profile._Id});
                    console.log("[Error]: New profile successfully created for user");
                }
            });
            if(err) console.trace(err);
            let role = (await User.findOne({_id:req.session._id},(err,user)=> {return user})).role;
            console.log("got role: redirecting... role:"+role);
            req.session.role  = role;
            if(role==="visitor"){
                res.redirect('/view/profile');
            }else{
                res.redirect('/dashboard');
            }

        });
    }else {
        req.flash('warning','You are not whitelisted, please contact the administrator');
        console.log(req.session);
        res.redirect('/');
    }
});

module.exports = router;