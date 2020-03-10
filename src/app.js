/**
 * The main app
 * @file app.js is main root file
 */

const dotenv = require('dotenv');
dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
const {load} = require('./loaders/loader.js');
const express = require('express');
const routes = require('./routes/routerHandler');
const app = express();
const {getIp} = require("./utils/utils");
const start = async () => {
    if (!process.env.PORT) throw new Error(".env file not found, or wrong path");
    await load(app);
    const logger = require('./middlewares/logger'); //This is put here, because of process.env not being loaded otherwise
    app.use(function (req, res, next) {
        logger.request.log("[REQUEST]: "+req.method+" request "+req.url+" Email "+((req.session.email) ? req.session.email : "unknown")+", Ip: "+getIp(req)+" Status code: "+res.statusCode+" User-agent: "+req.headers['user-agent']);
        next();
    });
    logger.info.log("[INFO]: Server started");
    app.use('/',routes);
};
start();

