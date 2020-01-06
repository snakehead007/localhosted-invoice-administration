const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController.js");
const { forwardAuthenticated } = require('../middlewares/auth');

router.get('/',forwardAuthenticated ,loginController.login_get);
router.post('/',loginController.login_post);
router.get('/register',forwardAuthenticated,loginController.create_user_get);
router.post('/register',loginController.create_user_post);

module.exports = router;