const express = require("express");
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/',walletController.getMainPage);
router.get('/success',walletController.getPaymentProcessPaypal);
router.get('/cancel',walletController.getPaymentCancelPaypal);
router.get('/error',walletController.getPaymentErrorPaypal);
router.get('/process',walletController.getPaymentProcessPaypal);
module.exports = router;