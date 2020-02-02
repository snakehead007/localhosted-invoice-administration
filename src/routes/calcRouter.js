//Currenlty this functionality is turned off
const express = require("express");
const router = express.Router();
const calcRouter = require("../controllers/calcController.js");

router.get('/all' ,calcRouter.getCalcAll);

module.exports = router;