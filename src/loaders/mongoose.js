const mongoose = require('mongoose');
module.exports.default = async () => {
    let db_uri;
    if (process.env.DEVELOP === "true") {
        db_uri = process.env.DB_URI_DEVELOP;
        let db;
        if (process.env.DEVELOP_NO_RANDOM_DB === "false") {
            db = String(Math.floor((Math.random() * 1000000000) + 99999999999));
        } else if (process.env.DEVELOP_NO_RANDOM_DB === "true") {
            db = process.env.DB_DEVELOP_NAME;
        }
        db_uri += "/" + db;
    } else {
        db_uri = process.env.DB_URI;
    }

    try {
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
        });
        mongoose.connection.on('close', () => {
        });
    } catch (e) {
        process.exit(1);
    }

};
