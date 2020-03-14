const express = require("express");
const router = express.Router();
const activityController = require('../controllers/activityController');
router.get('/', activityController.getActivity);
router.get('/deletes',activityController.getDeletesActivity);
router.get('/undo/:id', activityController.getUndoActivity);
router.get('/remove/:id',activityController.removeGet);
router.get('/removePerm/:id',activityController.removePermanently);
module.exports = router;