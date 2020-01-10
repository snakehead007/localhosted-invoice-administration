const express = require('express');
const {load} = require('./loaders/loader.js');
const routes = require('./routes/routerHandler');
const dotenv = require('dotenv');

async function start(){
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if(!process.env.PORT) throw new Error(".env file not found, or wrong path");
    console.log("[Info]: Dotenv config done");
    const app = express();
    await load(app);
    app.use('/',routes);
    console.log("[Info]: Routes loaded");
}
start();
