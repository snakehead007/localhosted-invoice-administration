const express = require("express");
const router = express.Router();
const profileController = require('../controllers/profileController');
const invoiceController = require('../controllers/invoiceController');
const orderController = require('../controllers/orderController');
const itemController = require('../controllers/itemController');

router.get('profile' ,profileController.edit_profile_get);
router.post('/profile/:idp',profileController.edit_profile_post);
router.get('/invoice/:idi',invoiceController.edit_invoice_get);
router.post('/invoice/:idi',invoiceController.edit_invoice_post);
router.get('/order/:ido',orderController.edit_order_get);
router.get('/item/:idi',itemController.edit_item_get);
router.get('/invoice/paid/:idi',invoiceController.invoice_paid_set);

module.exports = router;