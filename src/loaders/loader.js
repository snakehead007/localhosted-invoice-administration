const passport = require('passport');
const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const passportLoader = require('../middlewares/passport.js');

async function load( expressApp ) {
    console.log("[info]: Starting load");
    await passportLoader(passport);
    await mongooseLoader.default();
    console.log("[info]: mongoose loaded");
    await expressLoader.default( expressApp );
    console.log("[info]: express loaded");
}
module.exports.load = load;