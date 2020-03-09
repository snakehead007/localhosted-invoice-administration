const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const logger = require("../middlewares/logger");
/**
 * @info updates
 * @param fromUser : to ensure that the given client is from the user
 * @param client : the client to update, needs to be the mongoose object
 */
exports.undoClient = async (client, fromUser) => {
    let clientDeleted = await Client.updateOne({_id:client._id,fromUser:fromUser,isRemoved:true},{isRemoved:false},(err)=>{
        if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoClient on method Client.updateOne trace: "+err.message);});
    for(let invoiceID of client.invoices){
        let invoiceDeleted = await Invoice.updateOne({_id:invoiceID,fromUser:fromUser},{isRemoved:false},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoClient on method Invoice.updateOne trace: "+err.message);});
        let invoice = await Invoice.findOne({_id:invoiceID,fromUser:fromUser},(err,invoice) => {return invoice;},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoClient on method Invoice.findOne trace: "+err.message);});
        for(let orderID of invoice.orders){
            let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false},(err)=>{
                if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoClient on method Order.updateOne trace: "+err.message);});
        }
    }
    logger.info.log("[INFO]: successful undo client for User "+fromUser);
};

exports.undoInvoice = async (invoice,fromUser) => {
    await Invoice.updateOne({_id:invoice._id,fromUser:fromUser},{isRemoved:false},(err)=>{
        if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoInvoice on method Invoice.updateOne trace: "+err.message);});
    for(let orderID of invoice.orders){
        let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false},(err)=>{
            if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoInvoice on method Order.updateOne trace: "+err.message);});
    }

    logger.info.log("[INFO]: successful undo invoice for User "+fromUser);
};

exports.undoOrder = async (order,fromUser) => {
    await Order.updateOne({_id:order._id,fromUser:fromUser},{isRemoved:false},(err)=>{
        if(err) logger.error.log("[ERROR]: thrown at /src/utils/undo.undoOrder on method Order.updateOne trace: "+err.message);});

    logger.info.log("[INFO]: successful undo Order for User "+fromUser);
};