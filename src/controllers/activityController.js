const Activity = require('../models/activity');
const User = require('../models/user');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
const undo = require('../utils/undo');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');
const logger = require("../middlewares/logger");
const i18n = require("i18n");
const Error = require('../middlewares/error');
const M = require('../utils/mongooseSchemas');
/**
 * @apiVersion 3.0.0
 * @api {get} / getActivity
 * @apiHeader {String} describes idc here
 * @apiDescription shows a list of all the activities of the user
 * @apiName getActivity
 * @apiGroup ActivityRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
   {
   "settings":settings,
    "role":role,
    "profile":profile,
    "currentUrl":"activities",
    "activities":activities
   }
 */
exports.getActivity = async (req,res) => {
    res.render('activities',{
        "settings":await new M.settings().findOne(req,res,{fromUser:req.session._id}),
        "role":(await new M.user().findOne(req,res,{_id: req.session._id})).role,
        "profile":await new M.profile().findOne(req,res,{fromUser:req.session._id}),
        "currentUrl":"activities",
        "activities":await new M.activity().find(req,res,{fromUser:req.session._id}, null,{sort: {time: -1}})
    })
};


exports.getDeletesActivity = async (req,res) => {
    res.render('activities',{
        "settings":await new M.settings().findOne(req,res,{fromUser:req.session._id}),
        "role":(await new M.user().findOne(req,res,{_id: req.session._id})).role,
        "profile":await new M.profile().findOne(req,res,{fromUser:req.session._id}),
        "currentUrl":"activities",
        "activities":await new M.activity().find(req,res,{fromUser:req.session._id,type:"delete"}, null,{sort: {time: -1}})
    })
};

/**
 * @apiVersion 3.0.0
 * @api {get} /undo/:id getUndoActivity
 * @apiParam {String} _id of the object that has been removed
 * @apiParamExample {String} title:
     "ido": order._id
 * @apiDescription Undo the removal of an object by setting the isRemove of the object and subdocuments to false
 * @apiName getUndoActivity
 * @apiGroup ActivityRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
     redirect to /activity
 */
exports.getUndoActivity = async (req,res) => {
    let act = await Activity.findOne({_id:req.params.id,fromUser:req.session._id},(err,activity) => {
        Error.handler(req,res,err,'0A0200');return activity;});
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to undo a "+act.objectName);
    switch(act.objectName){
        case "client":
            let client = await Client.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,client) => {
                Error.handler(req,res,err,'0A0201');return client});
            await undo.undoClient(client,req.session._id);
            req.flash('success',i18n.__("Undo of the client was successful"));
            break;
        case "invoice":
            let invoice = await Invoice.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,invoice) => {
                Error.handler(req,res,err,'0A0202');return invoice});
            await undo.undoInvoice(invoice,req.session._id);
            if(invoice.isPaid) {
                await Client.findOne({
                    fromUser: req.session._id,
                    _id: invoice.fromClient
                }, async (err, client) => {
                    Error.handler(req,res,err,'0A0203');
                    await Client.updateOne({
                        fromUser: req.session._id,
                        _id: invoice.fromClient
                    }, {totalPaid: client.totalPaid+invoice.total}, (err) => {
                        Error.handler(req,res,err,'0A0204');
                    });
                });
            }
            req.flash('success',i18n.__("Undo of the invoice was successful"));
            break;
        case "line":
            let order = await Order.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,order) => {
                Error.handler(req,res,err,'0A0204');return order});
            console.log(act.withObjectId);
            let invoiceL = await Invoice.findOne({_id:order.fromInvoice,fromUser:req.session._id}, (err,invoice) => {
                Error.handler(req,res,err,'0A0205');return invoice});
            let updateInvoice = {
                total: invoiceL.total + (order.amount * order.price)
            };
            await Invoice.updateOne({fromUser: req.session._id, _id: invoiceL._id}, updateInvoice,(err) => {
                Error.handler(req,res,err,'0A0206');
            });
            if(invoiceL.isPaid) {
                await Client.findOne({
                    fromUser: req.session._id,
                    _id: invoiceL.fromClient
                }, async (err, client) => {
                    Error.handler(req,res,err,'0A0207');
                    await Client.updateOne({
                        fromUser: req.session._id,
                        _id: invoiceL.fromClient
                    }, {totalPaid: client.totalPaid + (order.amount * order.price)}, (err) => {
                        Error.handler(req,res,err,'0A0208');
                    });
                });
            }
            await undo.undoOrder(order,req.session._id);
            req.flash('success',i18n.__("Undo of the line was successful"));
            break;
        case "item":
            req.flash('success',i18n.__("this url doesnt work yet"));
            break;
    }
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is removing activity: "+JSON.stringify(act));
    await Activity.deleteOne({_id:req.params.id,fromUser:req.session._id},(err)=> {
        Error.handler(req,res,err,'0A0208');
    });
    res.redirect('/activity');
};

/**
 * @apiVersion 3.0.0
 * @api {get} /remove/:id removeGet
 * @apiParam {String} _id of the object to be removed
 * @apiParamExample {String} title:
     "ido": order._id
 * @apiDescription sets the object and its subdocuments property isRemoved to true
 * @apiName removeGet
 * @apiGroup ActivityRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
    redirect to /activity
 */
exports.removeGet = async (req,res)=> {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is removing activity: "+req.params.id);
    await Activity.deleteOne({_id:req.params.id,fromUser:req.session._id},(err) =>{
        Error.handler(req,res,err,'0A0300');});
    req.flash('success',"Successfully deleted the activity");
    res.redirect('/activity');
};

exports.removePermanently = async (req,res) => {
    logger.warning.log("[WARNING]: activityController.removePermanently is not available yet, "+req.params.email+" visited this.");
    req.flash('warning',"This option is not available yet");
    res.redirect('back');
};