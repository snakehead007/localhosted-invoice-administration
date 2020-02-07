const express = require("express");
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const invoiceNewSubRouter = require('./subRouters/invoiceNewSubRouter');
router.get('/all',invoiceController.invoice_all_get);
router.get('/all/:idc',invoiceController.invoice_all_client);
router.use('/new',invoiceNewSubRouter);
module.exports = router;