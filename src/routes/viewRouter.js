const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profileController');
const clientController = require('../controllers/clientController');
const invoiceController = require('../controllers/invoiceController');
const orderController = require('../controllers/orderController');

router.get('/profile',profileController.viewProfileGet);
router.get('/client/:idc',clientController.getClientView);
router.get('/invoice/:idi',invoiceController.view_invoice_get);
router.get('/order/:ido',orderController.view_order_get);

module.exports = router;