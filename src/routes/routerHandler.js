const express = require("express");
const router = express.Router();
const loginRouter = require("./loginRouter.js");
const dashboardRouter = require('./dashboardRouter');
const logoutRouter = require('./logoutRouter');
const redirectRouter = require('./redirectRouter');
const {stillSignedInCheck, alreadySignedInCheck} = require('../middlewares/checkers');
const viewRouter = require('./viewRouter');
const invoiceRouter = require('./invoiceRouter');
const clientRouter = require('./clientRouter');
const projectRouter = require('./projectRouter');
const stockRouter = require('./stockRouter');
const settingsRouter = require('./settingsRouter');
const calcRouter = require('./calcRouter');
const editRouter = require('./editRouter');
const uploadRouter = require('./uploadRouter');
const orderRouter = require('./orderRouter');
//Controllers
router.use("/",loginRouter); //index page
router.use("/dashboard",stillSignedInCheck,dashboardRouter);
router.use('/logout',logoutRouter);
router.use('/redirect',redirectRouter); //only used when logged in and redirected by google
router.use('/view',stillSignedInCheck,viewRouter);
router.use('/order',stillSignedInCheck,orderRouter);
router.use('/invoice',stillSignedInCheck,invoiceRouter);
router.use('/client',stillSignedInCheck,clientRouter);
router.use('/project',stillSignedInCheck,projectRouter);
router.use('/stock',stillSignedInCheck,stockRouter);
router.use('/settings',stillSignedInCheck,settingsRouter);
router.use('/calc',stillSignedInCheck,calcRouter);
router.use('/edit',stillSignedInCheck,editRouter);
router.use('/upload',stillSignedInCheck,uploadRouter);
//Routers
/*
router.use("/add");
router.use("/calc");
router.use("/pdf");
router.use("/upload");
router.use("/search");
*/

//ERROR handling
router.use((req, res) => {
    res.status(404).send('404: Page not Found');
});
router.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('500: Internal Server Error');
    next();
});

module.exports = router;