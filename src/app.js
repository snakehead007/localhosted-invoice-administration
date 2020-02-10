/**
 * The main app
 * @file app.js is main root file
 */

const {load} = require('./loaders/loader.js');
const express = require( 'express');
const dotenv = require('dotenv');
const routes = require('./routes/routerHandler');
const app = express();

async function start(){
    console.log('--------  Invoice-administration  -------');
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if(!process.env.PORT) throw new Error(".env file not found, or wrong path");
    if(process.env.LOGGING>1)
        console.log("[Info]: Dotenv config done");
    await load(app);
    if(process.env.LOGGING>1)
        console.log("[Info]: Routes loaded");
    app.use(function (req,res,next) {
        if(process.env.LOGGING>1)
            console.log("[%s request]: %s%s  from %s", req.method, process.env.LOCAL_URL,req.url,((req.session._id)?req.session._id:"unknown"));
        next();
    });
    app.use('/',routes);
}
start();

