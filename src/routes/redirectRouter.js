const express = require("express");
const router = express.Router();
const redirectController = require('../controllers/redirectController');
const User = require('../models/user');

router.get('/' ,redirectController.googleLogin,(req,res)=>{
    User.updateOne({_id:req.session._id},{lastLogin:Date.now()},function(err,user){
         if(err) console.trace(err);
        res.redirect('/dashboard');
    });
});

module.exports = router;