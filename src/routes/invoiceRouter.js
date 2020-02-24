const express = require("express");
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const invoiceNewSubRouter = require('./subRouters/invoiceNewSubRouter');
const invoiceUpgradeSubRouter = require('./subRouters/invoiceUpgradeSubRouter');
router.get('/all', invoiceController.invoiceAllGet);
router.get('/all/:idc', invoiceController.invoiceAllClient);
router.use('/new', invoiceNewSubRouter);
router.use('/change', invoiceUpgradeSubRouter);
module.exports = router;