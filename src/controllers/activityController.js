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
    const activities = await Activity.find({fromUser:req.session._id}, null,{sort: {time: -1}},(err,activities) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getActivity on method Activity.find trace: "+err.message);
        return activities});
    const role = (await User.findOne({_id: req.session._id}, (err, user) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getActivity on method User.findOne trace: "+err.message);return user;})).role;
    const profile = await Profile.findOne({fromUser:req.session._id}, (err,profile) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getActivity on method Profile.findOne trace: "+err.message);
        return profile;});
    const settings = await Settings.findOne({fromUser:req.session._id}, (err,settings) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getActivity on method Settings.findOne trace: "+err.message);return settings;});
    res.render('activities',{
        "settings":settings,
        "role":role,
        "profile":profile,
        "currentUrl":"activities",
        "activities":activities
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getUndoActivity on method Activity.findOne trace: "+err.message);return activity;});
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to undo a "+act.objectName);
    switch(act.objectName){
        case "client":
            let client = await Client.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,client) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getUndoActivity on method Client.findOne trace: "+err.message);return client});
            await undo.undoClient(client,req.session._id);
            req.flash('success',i18n.__("Undo of the client was successful"));
            break;
        case "invoice":
            let invoice = await Invoice.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,invoice) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getUndoActivity on method Invoice.findOne trace: "+err.message);return invoice});
            await undo.undoInvoice(invoice,req.session._id);
            req.flash('success',i18n.__("Undo of the invoice was successful"));
            break;
        case "line":
            let order = await Order.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,order) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getUndoActivity on method Order.findOne trace: "+err.message);return order});
            await undo.undoOrder(order,req.session._id);
            req.flash('success',i18n.__("Undo of the line was successful"));
            break;
        case "item":
            req.flash('success',i18n.__("this url doesnt work yet"));
            break;
    }
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is removing activity: "+JSON.stringify(act));
    await Activity.remove({_id:req.params.id,fromUser:req.session._id},(err)=> {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.getUndoActivity on method Activity.remove trace: "+err.message)
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
    await Activity.remove({_id:req.params.id,fromUser:req.session._id},(err) =>{
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/activityController.removeGet on method Activity.remove trace: "+err.message)});
    req.flash('success',"Successfully deleted the activity");
    res.redirect('/activity');
};

exports.removePermanently = async (req,res) => {
    logger.warning.log("[WARNING]: activityController.removePermanently is not available yet, "+req.params.email+" visited this.");
    req.flash('warning',"This option is not available yet");
    res.redirect('back');
};