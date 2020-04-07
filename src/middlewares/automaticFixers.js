const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
exports.automaticFixer = async (req,res,next) =>{
    //Put here fixes
    next();
};