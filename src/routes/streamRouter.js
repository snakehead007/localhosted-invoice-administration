const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get('/invoice/:idi', downloadController.streamInvoicePDF);
router.get('/offer/:idi', downloadController.streamOfferPDF);
router.get('/credit/:idi', downloadController.streamCreditPDF);

module.exports = router;