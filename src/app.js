import 'path';
import express from 'express';
import 'body-parser';
import 'mongoose';
import 'multer';
import 'fs';
import 'express-fileupload';
import 'image-to-base64';

import {load} from './loaders/loader.js';
import {router} from './routes/index.js';
async function startServer() {
    const app = express();
    await load(app);
    app.use("/",router);
    app.listen('3000',() => {
        console.log('Server is running at PORT ' + 3000);
    });
}

startServer();