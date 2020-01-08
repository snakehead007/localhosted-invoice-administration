const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
router.get('/' ,dashboardController.main_get);

module.exports = router;