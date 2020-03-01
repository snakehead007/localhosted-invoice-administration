const Activity = require('../models/activity');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');

exports.addActivity = async (description, fromUser, object,type="time" ,objectTodelete="") => {
    console.log("------------ADD ACTIVITY--------------");
    console.log('activity to keep: '+type);
    let info = "";
    if(type==="delete"){
        console.log("deleting "+objectTodelete+" : ");
        console.log(object);
        switch (objectTodelete) {
            case "client":
                info = object.ClientName;
                let clientDeleted = await Client.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                console.log('client removed:');
                console.log(clientDeleted);
                for(let invoiceID of object.invoices){
                    console.log("deleting invoice: ");
                    let invoiceDeleted = await Invoice.updateOne({_id:invoiceID,fromUser:fromUser},{isRemoved:true});
                    console.log('invoice removed: ');
                    console.log(invoiceDeleted);
                    let invoice = await Invoice.findOne({_id:invoiceID,fromUser:fromUser},(err,invoice) => {return invoice;});
                    console.log(invoice);
                    for(let orderID of invoice.orders){
                        console.log("deleting line: ");
                        let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:true});
                        console.log("line removed: ");
                        console.log(orderDeleted);
                    }
                }
                break;
            case "invoice":
                if(object.offerNr){
                    info = object.offerNr;
                }else if(object.creditNr){
                    info = object.creditNr;
                }else if(object.invoiceNr){
                    info = object.invoiceNr;
                }
                let invoiceDeleted = await Invoice.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true});
                console.log('invoice removed: ');
                for(let orderID of object.orders){
                    console.log("deleting line: ");
                    console.log(orderID);
                    let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:true});
                    console.log("line removed: ");
                    console.log(orderDeleted);
                }
                break;

            case "line":
                info = object.description;
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
       withObjectId: object._id,
       objectName:objectTodelete,
       info : info
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
    this.addActivity("Created new line",fromUser,order,"add");
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
    this.addActivity("Edited line",fromUser,order,"edit");
};
exports.editedProfile = async (profile, fromUser) => {
    this.addActivity("Edited profile",fromUser,profile,"edit");
};

//Deleting
exports.deleteClient = async (client, fromUser) => {
    this.addActivity("Deleted client",fromUser,client,"delete","client");
};
exports.deleteInvoice = async (invoice, fromUser) => {
    this.addActivity("Deleted invoice",fromUser,invoice,"delete","invoice");
};
exports.deleteOffer = async (invoice, fromUser) => {
    this.addActivity("Deleted offer",fromUser,invoice,"delete","invoice");
};
exports.deleteCredit = async (invoice, fromUser) => {
    this.addActivity("Deleted credit",fromUser,invoice,"delete","invoice");
};
exports.deleteOrder = async (order, fromUser) => {
    this.addActivity("Deleted line",fromUser,order,"delete","line");
};

