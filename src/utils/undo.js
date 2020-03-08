const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');

/**
 * @info updates
 * @param fromUser : to ensure that the given client is from the user
 * @param client : the client to update, needs to be the mongoose object
 */
exports.undoClient = async (client, fromUser) => {
    let clientDeleted = await Client.updateOne({_id:client._id,fromUser:fromUser,isRemoved:true},{isRemoved:false});
    for(let invoiceID of client.invoices){
        let invoiceDeleted = await Invoice.updateOne({_id:invoiceID,fromUser:fromUser},{isRemoved:false});
        let invoice = await Invoice.findOne({_id:invoiceID,fromUser:fromUser},(err,invoice) => {return invoice;});
        for(let orderID of invoice.orders){
            let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false});
        }
    }
};

exports.undoInvoice = async (invoice,fromUser) => {
    await Invoice.updateOne({_id:invoice._id,fromUser:fromUser},{isRemoved:false});
    for(let orderID of invoice.orders){
        let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false});
    }
};

exports.undoOrder = async (order,fromUser) => {
    await Order.updateOne({_id:order._id,fromUser:fromUser},{isRemoved:false});
};