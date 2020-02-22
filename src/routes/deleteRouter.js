const express = require("express");
const router = express.Router();
const deleteController = require("../controllers/deleteController.js");

router.get('/client/:idc', deleteController.delete_client);
router.get('/invoice/:idi', deleteController.delete_invoice_get);
router.get('/logo', deleteController.delete_logo_get);
router.get('/order/:ido', deleteController.delete_order_get);
module.exports = router;