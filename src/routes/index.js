const express = require("express");
const router = express.Router();
const loginRouter = require("./loginRouter.js");
const dashboardRouter = require('./dashboardRouter');
const logoutRouter = require('./logoutRouter');

//Controllers
router.use("/",loginRouter);
router.use("/dashboard",dashboardRouter);
router.use('/logout',logoutRouter);
//Routers
/*
router.all("/view");
router.all("/add");
router.all("/calc");
router.all("/pdf");
router.all("/edit");
router.all("/contact");
router.all("/invoice");
router.all("/stock");
router.all("/chart");
router.all("/upload");
router.all("/search");
router.all("/vat");
router.all("/settings");
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