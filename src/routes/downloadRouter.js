const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get('/invoice/:idi', downloadController.downloadInvoicePDF);
router.get('/offer/:idi', downloadController.downloadOfferPDF);
router.get('/credit/:idi', downloadController.downloadCreditPDF);

module.exports = router;