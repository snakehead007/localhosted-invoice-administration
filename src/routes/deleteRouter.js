const express = require("express");
const router = express.Router();
const deleteController = require("../controllers/deleteController.js");

router.get('/client/:idc', deleteController.deleteClient);
router.get('/invoice/:idi', deleteController.deleteInvoiceGet);
router.get('/logo', deleteController.deleteLogoGet);
router.get('/order/:ido', deleteController.deleteOrderGet);
module.exports = router;