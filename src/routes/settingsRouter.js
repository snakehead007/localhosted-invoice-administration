const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get('/' ,settingsController.settings_all_get);

module.exports = router;