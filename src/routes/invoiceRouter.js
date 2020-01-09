const express = require("express");
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
router.get('/all',invoiceController.invoice_all_get);
router.get('/new',  invoiceController.invoice_new_choose_get);
router.get('/new/:idc',invoiceController.invoice_new_get);
module.exports = router;