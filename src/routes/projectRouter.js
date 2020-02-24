/**
 *
 * @module routes/projectRouter
 */

const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController.js");

router.get('/all', projectController.project_all_get);

module.exports = router;