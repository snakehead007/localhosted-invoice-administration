/**
 * The main app
 * @file app.js is main root file
 */

const {load} = require('./loaders/loader.js');
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/routerHandler');
const app = express();
const events = require('./utils/events');

const start = async () => {
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
    await load(app);
    app.use(function (req, res, next) {
        let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        console.log("[%s request]: %s  from %s", req.method, req.url, ((req.session.email) ? req.session.email : "unknown with ip: "+ip));
        next();
    });
    app.use('/',routes);
};
start();

