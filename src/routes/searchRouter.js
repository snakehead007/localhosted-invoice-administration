const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController.js");

router.post('/', searchController.searchGet);

module.exports = router;