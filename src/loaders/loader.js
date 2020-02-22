const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');
const {images} = require('./images');
module.exports.load = async function load(app) {
    if (process.env.DEVELOP_WITH_GOOGLE === "true" && process.env.DEVELOP === "true") {
        //develop mode set
    }
    if (process.env.DEVELOP === "false" || (process.env.DEVELOP_WITH_GOOGLE === "true" && process.env.DEVELOP === "true")) {
        google.startUp();
    }
    await mongooseLoader.default();
    await expressLoader.default(app);
    await images(app);
};