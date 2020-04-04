const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
exports.automaticFixer = async (req,res,next) =>{
    //Reset profile all NrCurrents to its next available nr
    let allInvoices = Invoice.find({fromUser:req.session._id},null,{sort:{}});
    next();
};