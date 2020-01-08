const express = require("express");
const router = express.Router();
const loginRouter = require("./loginRouter.js");
const dashboardRouter = require('./dashboardRouter');
const logoutRouter = require('./logoutRouter');
const redirectRouter = require('./redirectRouter');
const {stillSignedInCheck} = require('../middlewares/checkers');
const viewRouter = require('./viewRouter');
const invoiceRouter = require('./invoiceRouter');
//Controllers
router.use("/",loginRouter); //index page
router.use("/dashboard",stillSignedInCheck,dashboardRouter);
router.use('/logout',logoutRouter);
router.use('/redirect',redirectRouter); //only used when logged in and redirected by google
router.use('/view',stillSignedInCheck,viewRouter);
router.use('/invoice',stillSignedInCheck,invoiceRouter);
//Routers
/*
router.use("/view");
router.use("/add");
router.use("/calc");
router.use("/pdf");
router.use("/edit");
router.use("/contact");
router.use("/invoice");
router.use("/stock");
router.use("/chart");
router.use("/upload");
router.use("/search");
router.use("/vat");
router.use("/settings");
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