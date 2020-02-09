const express = require("express");
const router = express.Router();
const validateRouter = require('../controllers/validateRouter');
/*
router.get('/iban/:iban',validateRouter.iban);
router.get('/bic/:bic',validateRouter.bic);
router.get('/vat/:vat',validateRouter.vat);
router.get('/streetNr/:nr',validateRouter.streetNr);
*/
router.get('/name/:name/:bool',validateRouter.name);
router.get('/name//:bool',validateRouter.noName);
module.exports = router;