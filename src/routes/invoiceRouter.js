const express = require("express");
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
router.get('/all',invoiceController.invoice_all_get);

module.exports = router;