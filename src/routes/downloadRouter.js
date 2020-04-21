const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");
const checkers = require('../middlewares/checkers');
router.get('/invoice/:idi',checkers.checkIfCreditPaid, downloadController.downloadInvoicePDF);
router.get('/offer/:idi', checkers.checkIfCreditPaid,downloadController.downloadOfferPDF);
router.get('/credit/:idi', checkers.checkIfCreditPaid,downloadController.downloadCreditPDF);

module.exports = router;