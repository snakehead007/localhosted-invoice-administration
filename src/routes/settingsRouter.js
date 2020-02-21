const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get('/' ,settingsController.settings_all_get);
router.get('/change/lang/:lang',settingsController.settingsChangeLangGet);
router.post('/change/text',settingsController.changeTextGet);
router.get('/change/theme/:theme',settingsController.settingsChangeThemeGet);

module.exports = router;