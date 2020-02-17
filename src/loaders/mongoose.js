const mongoose = require('mongoose');
module.exports.default = async () => {
    let db_uri;
    if(process.env.DEVELOP==="true"){
        db_uri=process.env.DB_URI_DEVELOP;
        let db;
        if(process.env.DEVELOP_NO_RANDOM_DB==="false") {
            db= String(Math.floor((Math.random() * 1000000000) + 99999999999));
        }else if(process.env.DEVELOP_NO_RANDOM_DB==="true"){
            db = process.env.DB_DEVELOP_NAME;
        }
        db_uri += "/" + db;
    }else{
        db_uri=process.env.DB_URI;
    }

    try {
        if(process.env.LOGGING>1)
            console.log("[Info]: Trying to connect to "+db_uri);
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
            if(process.env.LOGGING>0)
                console.log('[Info]: Mongoose connected!');
        });
        mongoose.connection.on('close', () => {
            if(process.env.LOGGING>0)
                console.log('[Info]: Mongoose connection lost!');
        });
    } catch (e) {
        console.log("[Error]: Timout error, failed to connect to mongodb");
        if(process.env.LOGGING>1) {
            console.log("[Info]: Check if .env file is correctly filled in (DEVELOP)");
            console.log("[Info]: Exiting now...");
        }
        process.exit(1);
    }

};
