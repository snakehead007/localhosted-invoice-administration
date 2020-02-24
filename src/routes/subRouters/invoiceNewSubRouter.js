const express = require("express");
const router = express.Router();
const invoiceController = require('../../controllers/invoiceController');

router.get('/invoice', invoiceController.invoiceNewChooseGet);
router.get('/offer', invoiceController.offerNewChooseGet);
router.get('/credit', invoiceController.creditNewChooseGet);
router.get('/invoice/:idc', invoiceController.invoiceNewGet);
router.get('/offer/:idc', invoiceController.offerNewGet);
router.get('/credit/:idc', invoiceController.creditNewGet);
router.post('/invoice', invoiceController.invoiceNewGet);
router.post('/offer', invoiceController.offerNewGet);
router.post('/credit', invoiceController.creditNewGet);

module.exports = router;