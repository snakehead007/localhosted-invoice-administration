const express = require("express");
const router = express.Router();
const redirectController = require('../controllers/redirectController');
router.get('/' ,redirectController.googleLogin,(req,res)=>{
    res.redirect('/dashboard');
});

module.exports = router;