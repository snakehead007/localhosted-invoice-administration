const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
router.get('/', dashboardController.mainGet);
router.get('/chart/:year', dashboardController.chartYearGet);
router.get("/about",dashboardController.about);
module.exports = router;