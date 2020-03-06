/**
 * @module routes/orderRouter
 */

const express = require("express");
const router = express.Router();
const mailController = require('../controllers/mailController');

router.get('/attachment/:idi',mailController.sendAttachment);
router.post('/bugreport',mailController.sendBugReport);
module.exports = router;