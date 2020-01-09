const path = require('path');
const express = require('express');
const {load} = require('./loaders/loader.js');
const routes = require('./routes/routerHandler');
const dotenv = require('dotenv');
const initialize = require('express-init');
const models = path.join(path.resolve(), './models');

async function start(){
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if(!process.env.PORT) throw new Error(".env file not found, or wrong path");
    const app = express();
    await load(app);
    app.use('/',routes);
    //process.on('SIGTERM', process.exit(1));
    //process.on('uncaughtException', process.exit(1));
    initialize(app, function(err) {
        if (err)
            throw new Error(err);
        app.listen(process.env.PORT,() => {
            console.log('[info]: server is running at PORT ' + process.env.PORT);
        });
    });
}
start();
