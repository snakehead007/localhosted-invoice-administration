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
const {stillSignedInCheck, checkIfAdminRole} = require("../middlewares/checkers");
const update = require("../middlewares/update");
const viewRouter = require("./viewRouter");
const invoiceRouter = require("./invoiceRouter");
const clientRouter = require("./clientRouter");
//const projectRouter = require("./projectRouter");
const settingsRouter = require("./settingsRouter");
//const calcRouter = require("./calcRouter");
const editRouter = require("./editRouter");
const uploadRouter = require("./uploadRouter");
const orderRouter = require("./orderRouter");
const downloadRouter = require("./downloadRouter");
const deleteRouter = require("./deleteRouter");
const searchRouter = require("./searchRouter");
const whitelistRouter = require("./whitelistRouter");
const streamRouter = require("./streamRouter");
const activityRouter = require('./activityRouter');
const mailRouter = require('./mailRouter');
const autoFix = require('../middlewares/automaticFixers');
const adminRouter = require('./adminRouter');
const supportRouter = require('./supportRouter');
//Controllers
try {
    router.use("/dashboard", stillSignedInCheck, update.updateUndoAbility,autoFix.automaticFixer, dashboardRouter);
    router.use("/logout", stillSignedInCheck, logoutRouter);
    router.use("/view", stillSignedInCheck, viewRouter);
    router.use("/order", stillSignedInCheck, orderRouter);
    router.use("/invoice", stillSignedInCheck, invoiceRouter);
    router.use("/client", stillSignedInCheck, clientRouter);
    router.use("/settings", stillSignedInCheck, settingsRouter);
    router.use("/edit", stillSignedInCheck, editRouter);
    router.use("/upload", stillSignedInCheck, uploadRouter);
    router.use("/download", stillSignedInCheck, downloadRouter);
    router.use("/delete", stillSignedInCheck, deleteRouter);
    router.use("/search", stillSignedInCheck, searchRouter);
    router.use("/stream", stillSignedInCheck, streamRouter);
    router.use('/activity', stillSignedInCheck, activityRouter);
    router.use('/mail', stillSignedInCheck, mailRouter);
    router.use('/support', stillSignedInCheck, supportRouter);
}catch(err){
    console.trace(err);
    router.use((req,res)=>{
        req.flash('danger',"something went wrong, please try again");
        res.redirect('back');
    })
}
try {
    router.use("/", loginRouter); //index page
    router.use("/redirect", redirectRouter); //only used when logged in and redirected by google
    router.use("/whitelist", whitelistRouter);
    router.use('/admin',stillSignedInCheck,adminRouter)
}catch(err){
    console.trace(err);
    router.use((req,res)=>{
        req.flash('danger',"something went wrong, please try again");
        res.redirect('/');
    })
}

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