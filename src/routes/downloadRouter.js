const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get('/invoice/:idi' ,downloadController.download_invoice_get);
router.get('/offer/:idi',downloadController.download_offer_get);
router.get('/credit/:idi',downloadController.download_credit_get);

module.exports = router;