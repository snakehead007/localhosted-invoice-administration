const express = require("express");
const router = express.Router();
const redirectController = require('../controllers/redirectController');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

router.get('/' ,redirectController.googleLogin,async (req,res)=>{
    const jsonfile = fs.readFileSync(path.join(__dirname, '../whitelist.json'));
    const whitelist = JSON.parse(jsonfile);
    let found = false;
    await whitelist.forEach(o => {
        console.log(req.session.email);
        console.log(o.mail);
        if(req.session.email===o.mail){
            console.log("set found to true");
            found = true;
        }
    });
    console.log(found);
    if(found){
        User.updateOne({_id:req.session._id},{lastLogin:Date.now()},function(err){
            if(err) console.trace(err);
            res.redirect('/dashboard');
        });
    }else {
        console.log('not found redirect /');
        res.redirect('/');
    }
});

module.exports = router;