const path = require('path');
const express = require('express');
const {load} = require('./loaders/loader.js');
const routes = require('./routes/index.js');
const dotenv = require('dotenv');

const models = path.join(path.resolve(), './models');

async function start(){
    dotenv.config({ path: '../.env' });
    const app = express();
    await load(app);

    app.use('/',routes);
    //process.on('SIGTERM', process.exit(1));
    //process.on('uncaughtException', process.exit(1));
}

start();
