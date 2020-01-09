const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');

router.all('/all/:idi',orderController.all_order_get);
router.get('/new/:idi' ,orderController.new_order_get);
router.post('/new/:idi',orderController.new_order_post);

module.exports = router;