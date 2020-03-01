const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');

exports.updateUndoAbility = async (req, res, next) => {
    //sets all objects that have no property of "isRemoved" to false
    let clients = await Client.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    let invoices = await Invoice.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    let orders = await Order.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    let items = await Item.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    console.log(clients);
    console.log(invoices);
    console.log(orders);
    console.log(items);

    //searches all orders for each invoice of the user, and adds it properly to the invoice.orders array
    //this didnt work in the earlier versions
    let invoicesAll = await Invoice.find({fromUser:req.session._id},(err,invoices)=>{return invoices;});
    for(let i of invoicesAll){
        if(i.orders.length===0){
            let orders   = await Order.find({fromUser:req.session._id,fromInvoice:i._id},(err,orders)=>{return orders;});
            for(let o of orders){
                i.orders.push(o._id);
            }
            await i.save();
        }
    }
    next();
};