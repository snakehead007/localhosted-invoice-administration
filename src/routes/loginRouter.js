const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController.js");

router.get('/' ,loginController.login_get);
router.get('/register',loginController.create_user_get);

module.exports = router;