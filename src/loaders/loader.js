const mongooseLoader = require('./mongoose.js');
const expressLoader = require('./express.js');
const google = require('../middlewares/google.js');
const {images} = require('./images');
module.exports.load= async function load( app ) {
    if(process.env.LOGGING>1)
        console.log("[Info]: Starting loaders");
    if(process.env.DEVELOP_WITH_GOOGLE==="true"&&process.env.DEVELOP==="true"){
        if(process.env.LOGGING>1)
            console.log('[Info]: Develop mode set');
    }
    if(process.env.DEVELOP==="false"||(process.env.DEVELOP_WITH_GOOGLE==="true"&&process.env.DEVELOP==="true")){
        google.startUp();
    }else{
        if(process.env.LOGGING>1)
            console.log("[Info]: Develop mode set, bypassing Google auth");
    }
    await mongooseLoader.default();
    if(process.env.LOGGING>1)
        console.log("[Info]: Mongoose loaded");
    await expressLoader.default(app);
    await images(app);
    if(process.env.LOGGING>1)
        console.log("[Info]: Express loaded");
};