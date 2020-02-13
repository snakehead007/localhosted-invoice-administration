/**
 * @module routes/orderRouter
 */

const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');

router.all('/all/:idi',orderController.all_order_get);
router.get('/new/:idi' ,orderController.new_order_get);
router.post('/new/:idi',orderController.new_order_post);
router.get('/edit/:ido',orderController.edit_order_get);
router.post('/edit/:ido',orderController.edit_order_post);

module.exports = router;