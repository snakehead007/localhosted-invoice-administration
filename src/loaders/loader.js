const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');
const {images} = require('./images');
module.exports.load= async function load( app ) {
    console.log("[Info]: Starting loaders");
    if(process.env.DEVELOP_WITH_GOOGLE==="true"&&process.env.DEVELOP==="true"){
        console.log('[Info]: Develop mode set');
    }
    if(process.env.DEVELOP==="false"||(process.env.DEVELOP_WITH_GOOGLE==="true"&&process.env.DEVELOP==="true")){
        google.startUp();
    }else{
        console.log("[Info]: Develop mode set, bypassing Google auth");
    }
    await mongooseLoader.default();
    console.log("[Info]: Mongoose loaded");
    await expressLoader.default(app);
    await images(app);
    console.log("[Info]: Express loaded");
};