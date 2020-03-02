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
    console.log('client delete undo:');
    console.log(clientDeleted);
    for(let invoiceID of client.invoices){
        console.log("undo invoice: ");
        let invoiceDeleted = await Invoice.updateOne({_id:invoiceID,fromUser:fromUser},{isRemoved:false});
        console.log('invoice delete undo: ');
        console.log(invoiceDeleted);
        let invoice = await Invoice.findOne({_id:invoiceID,fromUser:fromUser},(err,invoice) => {return invoice;});
        console.log(invoice);
        for(let orderID of invoice.orders){
            console.log("undo order: ");
            let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false});
            console.log("order delete undo: ");
            console.log(orderDeleted);
        }
    }
};

exports.undoInvoice = async (invoice,fromUser) => {
    await Invoice.updateOne({_id:invoice._id,fromUser:fromUser},{isRemoved:false});
    console.log('invoice delete undo: ');
    for(let orderID of invoice.orders){
        console.log("undo order: ");
        console.log(orderID);
        let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:false});
        console.log("order delete undo: ");
        console.log(orderDeleted);
    }
};

exports.undoOrder = async (order,fromUser) => {
    await Order.updateOne({_id:order._id,fromUser:fromUser},{isRemoved:false});
};