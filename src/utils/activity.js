const Activity = require('../models/activity');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');
const logger = require("../middlewares/logger");
const invoicesUtils = require('./invoices');
exports.addActivity = async (description, fromUser, object,type="time" ,_object="") => {
    logger.info.log("[INFO]: adding activity "+description+" of type "+type+" for user with id "+fromUser);
    let info = "";
    switch (_object) {
        case "invoice":
            if(type==="download"){
                if(object.offerNr){
                    description += " offer";
                }else if(object.creditNr){
                    description += " creditnote";
                }else if(object.invoiceNr){
                    description += " invoice";
                }
            }
            if(object.offerNr){
                info = object.offerNr;
            }else if(object.creditNr){
                info = object.creditNr;
            }else if(object.invoiceNr){
                info = object.invoiceNr;
            }
            break;
        case "client":
            info = object.clientName;
            break;
        case "order":
            info = object.description;
            break;
    }
    if(type==="delete"){
        switch (_object) {
            case "client":
                await Client.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true},(err)=>{
                    if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Client.updateOne trace: "+err.message);});
                for(let invoiceID of object.invoices){
                    await Invoice.updateOne({_id:invoiceID,fromUser:fromUser},{isRemoved:true},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Invoice.updateOne trace: "+err.message);});
                    let invoice = await Invoice.findOne({_id:invoiceID,fromUser:fromUser},(err,invoice) => {return invoice;},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Invoice.findOn trace: "+err.message);});
                    for(let orderID of invoice.orders){
                        await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:true},(err)=>{
                            if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Order.updateOne trace: "+err.message);});
                    }
                }
                logger.info.log("[INFO]: succesfully removed the client and all its subdocuments");
                break;
            case "invoice":
                let invoiceDeleted = await Invoice.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true},(err)=>{
                    if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Invoice.updateOne trace: "+err.message);});
                for(let orderID of object.orders){
                    let orderDeleted = await Order.updateOne({_id:orderID,fromUser:fromUser},{isRemoved:true},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Order.updateOne trace: "+err.message);});
                }
                break;
            case "line":
                await Order.updateOne({_id:object._id,fromUser:fromUser},{isRemoved:true},(err)=>{
                    if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method Order.updateOne trace: "+err.message);});
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
       objectName:_object,
       info : info
    });
    newAct.save((err)=>{
        if(err) logger.error.log("[ERROR]: thrown at /src/utils/activity.addActivity on method newAct.save trace: "+err.message);});
};

//Adding
exports.addClient = async (client,fromUser)=> {
    this.addActivity("Created new client "+client.clientName,fromUser,client,"add","client");
};
exports.addInvoice = async (invoice,fromUser) => {
  this.addActivity("Created new invoice "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"add","invoice");
};
exports.addOffer = async (invoice,fromUser) => {
  this.addActivity("Created new offer "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"add","invoice");
};
exports.addCredit = async (invoice, fromUser) => {
  this.addActivity("Created new creditnote "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"add","invoice");
};
exports.addOrder = async (order, fromUser) => {
    let invoice = await Invoice.findOne({_id:order.fromInvoice},(err,invoice)=>{

        return invoice;
    });
    this.addActivity("Created new line for "+invoicesUtils.getOnlyTypeOfInvoice(invoice)+' '+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,order,"add","line");
};

//Editing
exports.editedClient = async (client, fromUser) => {
    this.addActivity("Edited client "+client.clientName,fromUser,client,"edit","client");
};
exports.editedInvoice = async (invoice, fromUser) => {
    this.addActivity("Edited invoice "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"edit","invoice");
};
exports.editedOffer = async (invoice, fromUser) => {
    this.addActivity("Edited offer "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"edit","invoice");
};
exports.editedCredit = async (invoice, fromUser) => {
    this.addActivity("Edited credit "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"edit","invoice");
};
exports.editedOrder = async (order, fromUser) => {
    let invoice = await Invoice.findOne({_id:order.fromInvoice},(err,invoice)=>{

        return invoice;
    });
    this.addActivity("Created new line for "+invoicesUtils.getOnlyTypeOfInvoice(invoice)+' '+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,order,"edit","order");
};
exports.editedProfile = async (profile, fromUser) => {
    //no need to log this
    //this.addActivity("Edited your profile",fromUser,profile,"edit","profile");
};

//Deleting
exports.deleteClient = async (client, fromUser) => {
    this.addActivity("Deleted client "+client.clientName,fromUser,client,"delete","client");
};
exports.deleteInvoice = async (invoice, fromUser) => {
    this.addActivity("Deleted invoice "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"delete","invoice");
};
exports.deleteOffer = async (invoice, fromUser) => {
    this.addActivity("Deleted offer "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"delete","invoice");
};
exports.deleteCredit = async (invoice, fromUser) => {
    this.addActivity("Deleted credit "+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"delete","invoice");
};
exports.deleteOrder = async (order, fromUser) => {
    let invoice = await Invoice.findOne({_id:order.fromInvoice},(err,invoice)=>{

        return invoice;
    });
    this.addActivity("Created new line for "+invoicesUtils.getOnlyTypeOfInvoice(invoice)+' '+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,order,"delete","line");
};

//Download
exports.downloadInvoice = async (invoice,fromUser) => {
    this.addActivity("Downloaded "+invoicesUtils.getOnlyTypeOfInvoice(invoice)+' '+invoicesUtils.getDefaultNumberOfInvoice(invoice),fromUser,invoice,"download","invoice")
};

//login
exports.login = async (fromUser)=> {
    //this.addActivity("Logged in",fromUser,fromUser,"time","profile");
};

exports.logout = async (fromUser)=> {
    //this.addActivity("Logged out",fromUser,fromUser,"time","profile");
};

//upgrade

exports.upgrade = async (invoice,fromUser) => {
    this.addActivity("Upgraded offer "+invoicesUtils.getDefaultNumberOfInvoice(invoice)+" to invoice",fromUser,invoice,"upgrade","invoice")
};

exports.downgrade = async (invoice,fromUser) => {
    this.addActivity("downgraded invoice "+invoicesUtils.getDefaultNumberOfInvoice(invoice)+" to offer",fromUser,invoice,"upgrade","invoice")
};

//status

exports.setPaid = async (invoice,status,fromUser) => {
    let invoiceStr = "invoice "+invoicesUtils.getDefaultNumberOfInvoice(invoice);
    let description = (status)?"Set "+invoiceStr+" to paid":"Set "+invoiceStr+"to unpaid";
    this.addActivity(description,fromUser,invoice,"change","invoice")
};


exports.setAgreed = async (invoice,status,fromUser) => {
    let offerStr = "offer "+invoicesUtils.getDefaultNumberOfInvoice(invoice);
    let description = (status)?"Set "+offerStr+"to agreed":"Set "+offerStr+"to disagreed";
    this.addActivity(description,fromUser,invoice,"change","invoice")
};


//settings

exports.changedLanguage = async (lang,fromUser) => {
    let langFull;
    switch(lang){
        case "nl-BE":
            langFull = "Nederlands";
            break;
        case "en-GB":
            langFull = "English";
            break;
    }
    //this.addActivity("Changed language to "+langFull,fromUser,fromUser,"settings","other");
};

exports.changedTheme = async (theme,fromUser) => {
    let themeName;
    switch(theme){
        case "primary":
            themeName="blue";
            break;
        case "secondary":
            themeName="grey";
            break;
        case "dark":
            themeName="black";
            break;
        case "success":
            themeName = "green";
            break;
        case "danger":
            themeName = "red";
            break;
        case "warning":
            themeName = "yellow";
            break;
    }
    //this.addActivity("Changed theme to "+themeName,fromUser,fromUser,"settings","other");
};

