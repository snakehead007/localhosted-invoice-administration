/**
 * @module routes/orderRouter
 */

const express = require("express");
const router = express.Router();
const mailController = require('../controllers/mailController');
router.post('/bugreport',mailController.sendBugReport);
router.post('/support',mailController.sendSupport);
router.post('/sendToBasecone/:idi',mailController.sendToBasecone);
module.exports = router;
