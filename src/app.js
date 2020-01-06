const path = require('path');
const express = require('express');/*
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const expressFileupload = require('express-fileupload');
const imageToBase64 = require('image-to-base64');
const config = require("config");*/
const {load} = require('./loaders/loader.js');
const routes = require('./routes/index.js');
const dotenv = require('dotenv');

const models = path.join(path.resolve(), './models');

async function start(){
    dotenv.config({ path: '../.env' });
    const app = express();
    await load(app);

    app.listen(process.env.PORT,() => {
        console.log('Server is running at PORT ' + process.env.PORT);
    });

    app.use('/',routes);
    process.on('SIGTERM', server.close());
    process.on('uncaughtException', server.close());
}

start();
