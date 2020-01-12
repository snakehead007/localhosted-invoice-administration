const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController.js");

router.get('/all' ,stockController.stock_all_get);
router.get('/new/item',stockController.stock_new_item_get);

module.exports = router;