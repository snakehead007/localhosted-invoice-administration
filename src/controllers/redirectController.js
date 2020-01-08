const express = require('express');
const {getGoogleAccountFromCode,checkSignIn} = require('../middlewares/google');

exports.googleLogin = async (req,res,next) => {
    req.session._id = await checkSignIn(await getGoogleAccountFromCode(req.query.code));
    next();
};