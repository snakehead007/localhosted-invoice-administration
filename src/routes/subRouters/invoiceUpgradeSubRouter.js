const express = require("express");
const router = express.Router();
const invoiceController = require('../../controllers/invoiceController');

router.get('/upgrade/:idi',invoiceController.invoiceUpgradeGet);
router.get('/downgrade/:idi',invoiceController.invoiceDowngradeGet);

module.exports = router;