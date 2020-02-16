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


//Local modules
const User = require('../models/user');
const redirectController = require('../controllers/redirectController');

//Get requests
/**
 * Handles GET /redirect
 * Goes to {@link src/controllers/redirectController.googleLogin|RedirectController.googleLogin} then checks if user.email is in whitelist.
 */
router.get('/' ,redirectController.googleLogin,  async (req,res)=>{
    const jsonfile = fs.readFileSync(path.join(__dirname, '../whitelist.json'));
    const whitelist = JSON.parse(jsonfile);
    let found = false;
    await whitelist.forEach(o => {
        if(req.session.email===o.mail){
            found = true;
        }
    });
    if(found){
        User.updateOne({_id:req.session._id},{lastLogin:Date.now()},function(err){
            if(err) console.trace(err);
            res.redirect('/dashboard');
        });
    }else {
        req.flash('warning','You are not whitelisted, please contact the administrator');
        console.log(req.session);
        res.redirect('/');
    }
});

module.exports = router;