const Activity = require('../models/activity');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');

exports.addActivity = async (description, fromUser, object,type="time" ,objectTodelete="") => {
    //create new activity here;
    if(type==="delete"){
        switch (objectTodelete) {
            case "client":
                await Client.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                let client = await Client.find({_id:object._id,fromUser:fromUser},(err,client) => {return client});
                for(let invoices of client.invoices){
                    await Invoice.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                    let invoice = await Invoice.find({_id:object._id,fromUser:fromUser},(err,invoice) => {return invoice});
                    for(let order of invoice.orders){
                        await Order.updateOne({_id:order._id,fromUser:fromUser},{isRemoved:true});
                    }
                }
                break;
            case "invoice":
                await Invoice.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                let invoice = await Invoice.find({_id:object._id,fromUser:fromUser},(err,invoice) => {return invoice});
                for(let order of invoice.orders){
                    await Order.updateOne({_id:order._id,fromUser:fromUser},{isRemoved:true});
                }
                break;

            case "order":
                await Order.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                break;
            case "item":
                break;
        }
    }
    const newAct = new Activity({
       type:type,
       description:description,
       fromUser:fromUser,
       withObjectId: object._id
    });
    newAct.save();
};

//Adding
exports.addClient = async (client,fromUser)=> {
    this.addActivity("Created new client",fromUser,client,"add");
};
exports.addInvoice = async (invoice,fromUser) => {
  this.addActivity("Created new invoice",fromUser,invoice,"add");
};
exports.addOffer = async (invoice,fromUser) => {
  this.addActivity("Created new offer",fromUser,invoice,"add");
};
exports.addCredit = async (invoice, fromUser) => {
  this.addActivity("Created new creditnote",fromUser,invoice,"add");
};
exports.addOrder = async (order, fromUser) => {
    this.addActivity("Created new order",fromUser,order,"add");
};

//Editing
exports.editedClient = async (client, fromUser) => {
    this.addActivity("Edited client",fromUser,client,"edit");
};
exports.editedInvoice = async (invoice, fromUser) => {
    this.addActivity("Edited client",fromUser,invoice,"edit");
};
exports.editedOffer = async (invoice, fromUser) => {
    this.addActivity("Edited offer",fromUser,invoice,"edit");
};
exports.editedCredit = async (invoice, fromUser) => {
    this.addActivity("Edited credit",fromUser,invoice,"edit");
};
exports.editedOrder = async (order, fromUser) => {
    this.addActivity("Edited order",fromUser,order,"edit");
};
exports.editedProfile = async (profile, fromUser) => {
    this.addActivity("Edited profile",fromUser,profile,"edit");
};

//Deleting
exports.deleteClient = async (client, fromUser) => {
    this.addActivity("Deleted client",fromUser,client,"delete","client");
};
exports.deleteInvoice = async (invoice, fromUser) => {
    this.addActivity("Deleted client",fromUser,invoice,"delete","invoice");
};
exports.deleteOffer = async (invoice, fromUser) => {
    this.addActivity("Deleted offer",fromUser,invoice,"delete","invoice");
};
exports.deleteCredit = async (invoice, fromUser) => {
    this.addActivity("Deleted credit",fromUser,invoice,"delete","invoice");
};
exports.deleteOrder = async (order, fromUser) => {
    this.addActivity("Deleted order",fromUser,order,"delete","order");
};

