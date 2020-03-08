const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');

exports.updateUndoAbility = async (req, res, next) => {
    //sets all objects that have no property of "isRemoved" to false
    await Client.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    await Invoice.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    await Order.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    await Item.updateMany({fromUser:req.session._id,isRemoved:null},{isRemoved:false});
    //Adds the isSend property to invoices that doesn't have a isSend property yet. will set it too 'false'
    await Invoice.updateMany({fromUser:req.session._id,isSend:null},{isSend:false});

    //searches all orders for each invoice of the user, and adds it properly to the invoice.orders array
    //this didnt work in the earlier versions
    let invoicesAll = await Invoice.find({fromUser:req.session._id},(err,invoices)=>{return invoices;});
    for(let i of invoicesAll){
        if(i.orders.length===0){
            let orders = await Order.find({fromUser:req.session._id,fromInvoice:i._id},(err,orders)=>{return orders;});
            for(let o of orders){
                i.orders.push(o._id);
            }
            await i.save();
        }
    }


    //adds the totalPaid on the clients that doesn't have a totalPaid property
    let clientsAll = await Client.find({fromUser:req.session._id,totalPaid:null},(err,clients)=>{return clients;});
    for(let i of clientsAll){
        let invoices = await Invoice.find({fromUser:req.session._id,fromClient:i._id,isPaid:true},(err,invoices)=>{return invoices;});
        let total = 0.0;
        for(let i of invoices){
            total+=i.total;
        }
        await Client.updateOne({fromUser:req.session._id,_id:i._id},{totalPaid:total});
    }

    next();
};