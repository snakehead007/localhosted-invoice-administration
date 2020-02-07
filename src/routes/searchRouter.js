const express = require("express");
const router = express.Router();
const searchController = require("../controllers/stockController.js");

router.post('/search' ,searchController);

module.exports = router;