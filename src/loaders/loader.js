const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');

module.exports.load= async function load( app ) {
    console.log("[Info]: Starting loaders");
    if(process.env.DEVELOP==="false"){
        google.startUp();
    }else{
        console.log("[Info]: Develop mode set, bypassed google startUp");
    }
    mongooseLoader.default();
    console.log("[Info]: Mongoose loaded");
    await expressLoader.default(app);
    console.log("[Info]: Express loaded");
};