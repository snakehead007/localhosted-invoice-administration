const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController.js");
/*
router.get('/all', stockController.stockAllGet);
router.get('/new/item', stockController.stockNewItemGet);
router.post("/new/item", stockController.stockNewItemPost);
*/
module.exports = router;