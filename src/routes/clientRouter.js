const express = require("express");
const router = express.Router();
const clientController = require('../controllers/clientController');
router.get('/all', clientController.getClientAll);
router.get('/new', clientController.getClientNew);
router.post('/new', clientController.postClientNew);
module.exports = router;