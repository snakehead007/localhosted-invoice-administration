const express = require('express');
const {getGoogleAccountFromCode,checkSignIn} = require('../middlewares/google');

exports.googleLogin = async (req,res,next) => {
    const _id = await checkSignIn(await getGoogleAccountFromCode(req.query.code));
    console.log("GOOGLELOGIN: "+_id);
    req.session._id = _id;
    next();
};