const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get('/' ,settingsController.settings_all_get);
router.get('/change/lang/:lang',settingsController.settings_change_lang_get);
router.post('/change/text',settingsController.change_text_post);

module.exports = router;