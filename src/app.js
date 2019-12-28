const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const expressFileupload = require('express-fileupload');
const imageToBase64 = require('image-to-base64');

const {load} = require('./loaders/loader.js');
const routes = require('./routes/index.js');
const dotenv = require('./loaders/dotenv.js');

async function startServer() {
    const app = express();
    await load(app);
    app.use('/',routes);
}
startServer();