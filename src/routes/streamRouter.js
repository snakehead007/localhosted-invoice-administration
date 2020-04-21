const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");
const checkers = require('../middlewares/checkers');
router.get('/invoice/:idi',checkers.checkIfCreditPaid, downloadController.streamInvoicePDF);
router.get('/offer/:idi', checkers.checkIfCreditPaid,downloadController.streamOfferPDF);
router.get('/credit/:idi', checkers.checkIfCreditPaid,downloadController.streamCreditPDF);

module.exports = router;