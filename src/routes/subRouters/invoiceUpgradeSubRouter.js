const express = require("express");
const router = express.Router();
const invoiceController = require('../../controllers/invoiceController');

router.get('/upgrade/:idi',invoiceController.invoice_upgrade_get);
router.get('/downgrade/:idi',invoiceController.invoice_downgrade_get);

module.exports = router;