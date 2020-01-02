const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const dotenvLoader = require('./dotenv.js');
const passport = require("passport");

async function load( expressApp ) {
    console.log("[info]: Starting load");
    await dotenvLoader.default(expressApp);
    console.log("[info]: dotevn file loaded");
    await mongooseLoader.default();
    console.log("[info]: mongoose loaded");
    await expressLoader.default( expressApp , passport);
    console.log("[info]: express loaded");
}
module.exports.load = load;