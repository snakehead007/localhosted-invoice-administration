const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const expressFileupload = require('express-fileupload');
const imageToBase64 = require('image-to-base64');
const passport = require('passport');
const config = require("config");
const {load} = require('./loaders/loader.js');
const routes = require('./routes/index.js');
const dotenv = require('./loaders/dotenv.js');
const models = path.join(path.resolve(), './src/models');



async function start(){
    fs.readdirSync(models)
        .filter(file => ~file.indexOf('.js'))
        .forEach(file => require(path.join(models, file)));
    const app = express();
    const passportLoader = require('./middlewares/passport.js');
    passportLoader(passport);
    await load(app);

    app.listen(dotenv.PORT,() => {
        console.log('Server is running at PORT ' + dotenv.PORT);
    });

    app.use('/',routes);
}

start();
