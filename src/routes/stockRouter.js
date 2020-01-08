const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController.js");

router.get('/all' ,stockController.stock_all_get);

module.exports = router;