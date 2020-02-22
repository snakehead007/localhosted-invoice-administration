/**
 * @module routes/orderRouter
 */

const express = require("express");
const router = express.Router();
const orderController = require('../controllers/orderController');

router.all('/all/:idi', orderController.allOrderGet);
router.get('/new/:idi', orderController.newOrderGet);
router.post('/new/:idi', orderController.newOrderPost);
router.get('/edit/:ido', orderController.editOrderGet);
router.post('/edit/:ido', orderController.editOrderPost);

module.exports = router;