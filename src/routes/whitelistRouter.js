const express = require("express");
const router = express.Router();
const whitelistController = require('../controllers/whitelistController');
router.get('/:secret/:mail',whitelistController.addToWhitelist);

module.exports = router;