const mongoose = require('mongoose');
module.exports.default = async () => {
    try {
        console.log("[Info]: Trying to connect to "+process.env.DB_URI);
        await mongoose.connect(process.env.DB_URI, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (e) {
        console.log("[Error]: Timout error, failed to connect to mongodb");
        process.exit(1);
    }
    mongoose.connection.on('open', () => {
        console.log('[Info]: Mongoose connected!');
    });
    mongoose.connection.on('close', () => {
        console.log('[Info]: Mongoose connection lost!');
    });
};
