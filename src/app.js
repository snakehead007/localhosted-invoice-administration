const {load} = require('./loaders/loader.js');
const express = require( 'express');
const dotenv = require('dotenv');
const routes = require('./routes/routerHandler');
const app = express();

async function start(){
    dotenv.config(); //when starting up node inside the src folder, use => .config({ path: '../.env' }
    if(!process.env.PORT) throw new Error(".env file not found, or wrong path");
    console.log("[Info]: Dotenv config done");
    await load(app);
    app.listen(process.env.PORT,() => {
        console.log('[Info]: Server is running at PORT ' + process.env.PORT);
    });
    console.log("[Info]: Routes loaded");
}
start();

app.use('/',routes);