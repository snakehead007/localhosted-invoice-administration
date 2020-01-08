const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profileController');
router.get('profile' ,profileController);
router.get('invoice');
router.get('settings');
router.get('order');
router.get('item');

module.exports = router;