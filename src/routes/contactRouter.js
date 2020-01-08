const express = require("express");
const router = express.Router();
const contactController = require('../controllers/contactController');
router.get('/all',contactController.contact_all_get);

module.exports = router;