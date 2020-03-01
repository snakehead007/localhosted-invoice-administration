const express = require("express");
const router = express.Router();
const activityController = require('../controllers/activityController');
router.get('/', activityController.getActivity);
router.get('/undo/:id', activityController.getUndoActivity);
module.exports = router;