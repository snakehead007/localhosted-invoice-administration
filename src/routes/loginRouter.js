const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController.js");

router.get('/', loginController.login_get);
router.post('/',loginController.login_post);
router.get('/new',loginController.create_user_get);

module.exports = router;