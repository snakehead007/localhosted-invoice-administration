const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profileController');
const invoiceController = require('../controllers/invoiceController');
const orderController = require('../controllers/orderController');
const itemController = require('../controllers/itemController');
const clientController = require('../controllers/clientController');
router.get('profile' ,profileController.editProfileGet);
router.post('/profile/:idp',profileController.editProfilePost);
router.get('/invoice/:idi',invoiceController.editInvoiceGet);
router.post('/invoice/:idi',invoiceController.editInvoicePost);
router.get('/order/:ido',orderController.edit_order_get);
router.get('/item/:idi',itemController.edit_item_get);
router.get('/invoice/paid/:idi',invoiceController.invoice_paid_set);
router.get('/client/:idc',clientController.getEditClient);
router.post('/client/:idc',clientController.postEditClient);

module.exports = router;