const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController.js");

router.get("/logo", uploadController.uploadLogoGet);
router.post("/logo", uploadController.uploadLogoPost);
module.exports = router;