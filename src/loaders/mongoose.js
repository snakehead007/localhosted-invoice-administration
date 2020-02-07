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
        console.log("[Info]: Trying to connect to "+db_uri);
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
            console.log('[Info]: Mongoose connected!');
        });
        mongoose.connection.on('close', () => {
            console.log('[Info]: Mongoose connection lost!');
        });
    } catch (e) {
        console.log("[Error]: Timout error, failed to connect to mongodb");
        process.exit(1);
    }

};
