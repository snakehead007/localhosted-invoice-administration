const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController.js");

router.get("/", supportController.getSupportPage);
module.exports = router;