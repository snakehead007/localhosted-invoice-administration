const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController.js");
const {upload} = require('../middlewares/multer');

router.get('/logo' ,uploadController.upload_logo_get);
router.post('/logo',upload,uploadController.upload_logo_post);
module.exports = router;