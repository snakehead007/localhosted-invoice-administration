/**
 * @module routes/orderRouter
 */

const express = require("express");
const router = express.Router();
const mailController = require('../controllers/mailController');
router.post('/bugreport',mailController.sendBugReport);
router.get('/attachment/:idi',mailController.sendAttachment);
module.exports = router;