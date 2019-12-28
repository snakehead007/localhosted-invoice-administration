const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const dotenvLoader = require('./dotenv.js');

async function load( expressApp ) {
    await dotenvLoader.default(expressApp);
    await mongooseLoader.default();
    await expressLoader.default( expressApp );
}
module.exports.load = load;