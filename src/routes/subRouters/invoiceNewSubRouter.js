const express = require("express");
const router = express.Router();
const invoiceController = require('../../controllers/invoiceController');

router.get('/invoice',invoiceController.invoice_new_choose_get);
router.get('/offer',invoiceController.offer_new_choose_get);
router.get('/credit',invoiceController.credit_new_choose_get);
router.get('/invoice/:idc',invoiceController.invoice_new_get);
router.get('/offer/:idc',invoiceController.offer_new_get);
router.get('/credit/:idc',invoiceController.credit_new_get);

module.exports = router;