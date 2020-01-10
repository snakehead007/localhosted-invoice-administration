const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');

async function load( expressApp ) {
    console.log("[Info]: Starting loaders");
    google.startUp();
    await mongooseLoader.default();
    console.log("[Info]: Mongoose loaded");
    await expressLoader.default( expressApp );
    console.log("[Info]: Express loaded");
}
module.exports.load = load;