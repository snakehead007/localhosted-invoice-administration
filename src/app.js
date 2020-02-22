/**
 * The main app
 * @file app.js is main root file
 */

const {load} = require('./loaders/loader.js');
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/routerHandler');
const app = express();

const start = async () => {
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
    await load(app);
    app.use(function (req, res, next) {
        console.log("[%s request]: %s  from %s", req.method, req.url, ((req.session.email) ? req.session.email : "unknown"));
        next();
    });
    app.use('/', routes);
};
start();

