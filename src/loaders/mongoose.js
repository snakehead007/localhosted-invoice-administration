const mongoose = require('mongoose');
module.exports.default = async () => {
    try {
        //const db_uri = process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_DB;
        const db_uri="mongodb://"+process.env.MONGO_HOST+":27017/db";
        await mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    } catch (e) {
        //console.log('[Error]: Failed to connect to ' + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + ', trying ' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT_BACKUP);
        //const db_uri = process.env.MONGO_HOST + ":" + process.env.MONGO_PORT_BACKUP + "/" + process.env.MONGO_DB;
        console.log("[Error]: Failed to connect, trying on port 32777");
        const db_uri = "mongodb://"+process.env.MONGO_HOST+":32777/db";
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
    }
    mongoose.connection.on('open', () => {
        console.log('[Info]: Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('[Info]: Mongoose connection lost!');
    });
};
