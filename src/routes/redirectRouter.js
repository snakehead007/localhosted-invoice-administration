/**
 * Handles redirections from google login
 * @module routes/redirectRouter
 * @file routes/redirectRouter
 */

//installed modules
const express = require("express");
const router = express.Router();

//Local modules
const redirectController = require('../controllers/redirectController');
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
router.get('/', redirectController.googleLogin, redirectController.checkWhitelistGet);

module.exports = router;