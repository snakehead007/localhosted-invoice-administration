const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
const google = require("../middlewares/google");
router.get('/' ,dashboardController.main_get);

module.exports = router;