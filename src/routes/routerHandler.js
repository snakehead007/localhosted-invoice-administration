/**
 * Handles all the routers
 * @file routes/index
 * @module routes/routerHandler
 * @author snakehead007
 * */
const express = require("express");
const router = express.Router();
const loginRouter = require("./loginRouter.js");
const dashboardRouter = require("./dashboardRouter");
const logoutRouter = require("./logoutRouter");
const redirectRouter = require("./redirectRouter");
const {stillSignedInCheck} = require("../middlewares/checkers");
const viewRouter = require("./viewRouter");
const invoiceRouter = require("./invoiceRouter");
const clientRouter = require("./clientRouter");
//const projectRouter = require("./projectRouter");
const stockRouter = require("./stockRouter");
const settingsRouter = require("./settingsRouter");
//const calcRouter = require("./calcRouter");
const editRouter = require("./editRouter");
const uploadRouter = require("./uploadRouter");
const orderRouter = require("./orderRouter");
const downloadRouter = require("./downloadRouter");
const deleteRouter = require("./deleteRouter");
const validateRouter = require("./validateRouter");
const searchRouter = require("./searchRouter");
const whitelistRouter = require("./whitelistRouter");
const streamRouter = require("./streamRouter");
const activityRouter = require('./activityRouter');
//Controllers

router.use("/", loginRouter); //index page
router.use("/dashboard", stillSignedInCheck, dashboardRouter);
router.use("/logout", stillSignedInCheck, logoutRouter);
router.use("/redirect", redirectRouter); //only used when logged in and redirected by google
router.use("/view", stillSignedInCheck, viewRouter);
router.use("/order", stillSignedInCheck, orderRouter);
router.use("/invoice", stillSignedInCheck, invoiceRouter);
router.use("/client", stillSignedInCheck, clientRouter);
//router.use("/project",stillSignedInCheck,projectRouter);
router.use("/stock", stillSignedInCheck, stockRouter);
router.use("/settings", stillSignedInCheck, settingsRouter);
//router.use("/calc",stillSignedInCheck,calcRouter);
router.use("/edit", stillSignedInCheck, editRouter);
router.use("/upload", stillSignedInCheck, uploadRouter);
router.use("/download",stillSignedInCheck, downloadRouter);
router.use("/delete", stillSignedInCheck, deleteRouter);
router.use("/valid", validateRouter);
router.use("/search", stillSignedInCheck, searchRouter);
router.use("/whitelist", whitelistRouter);
router.use("/stream", stillSignedInCheck,streamRouter);
router.use('/activity',stillSignedInCheck,activityRouter);

//Routers
if (process.env.DEVELOP === "false") {
//error handling for 404
    router.use((req, res) => {
        res.status(404).send("404: Page not Found");
    });
//error handling for 500
    router.use((error, req, res, next) => {
        res.status(500).send("500: Internal Server Error");
        next();
    });
}
//This fixed this error: "database names cannot contain the character "." MongoError"
router.get("/favicon.ico", function (req, res) {
    res.sendStatus(204);
});

module.exports = router;