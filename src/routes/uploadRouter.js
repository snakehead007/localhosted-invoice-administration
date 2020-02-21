const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController.js");

router.get("/logo" ,uploadController.upload_logo_get);
router.post("/logo",uploadController.upload_logo_post);
module.exports = router;