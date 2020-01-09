const express = require("express");
const router = express.Router();
const clientController = require('../controllers/clientController');
router.get('/all',clientController.client_all_get);
router.get('/new',clientController.client_new_get);
router.post('/new',clientController.client_new_post);
module.exports = router;