//Currenlty this functionality is turned off
const express = require("express");
const router = express.Router();
const calcRouter = require("../controllers/calcController.js");

router.get('/all' ,calcRouter.calc_all_get);

module.exports = router;