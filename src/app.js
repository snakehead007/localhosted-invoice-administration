import 'path';
import express from 'express';
import 'body-parser';
import 'mongoose';
import 'multer';
import 'fs';
import 'express-fileupload';
import 'image-to-base64';

import {load} from './loaders/loader.js';

async function startServer() {
    const app = express();

    await load(app);
    app.use("/","routes");
    app.listen('3000', err ,() => {
        if(err){
            console.log("Err: "+err);
            process.exit(1);
            return;
        }
        console.log('Server is running at PORT ' + 3000);
    });
}

startServer();