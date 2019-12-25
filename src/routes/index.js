const express = require("express");
const auth = require("../middlewares/auth");
const controller = require("../controllers/index");
const router = express().Router();

router.all("/view");
router.all("/add");
router.all("/calc");
router.all("/pdf");
router.all("/edit");
router.all("/cµontact");
router.all("/invoice");
router.all("/stock");
router.all("/chart");
router.all("/upload");
router.all("/search");
router.all("/vat");
router.all("/settings");



