const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');

async function load( expressApp ) {
    console.log("[info]: Starting load");
    google.startUp();
    await mongooseLoader.default();
    console.log("[info]: mongoose loaded");
    await expressLoader.default( expressApp );
    console.log("[info]: express loaded");
}
module.exports.load = load;