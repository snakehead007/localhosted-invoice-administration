const Activity = require('../models/activity');
const User = require('../models/user');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
const undo = require('../utils/undo');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');
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
    const activities = await Activity.find({fromUser:req.session._id}, null,{sort: {time: -1}},(err,activities) => {return activities});
    console.log(activities);
    const role = (await User.findOne({_id: req.session._id}, (err, user) => {return user})).role;
    const profile = await Profile.findOne({fromUser:req.session._id}, (err,profile) => { return profile});
    const settings = await Settings.findOne({fromUser:req.session._id}, (err,settings) => { return settings});
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
    let act = await Activity.findOne({_id:req.params.id,fromUser:req.session._id},(err,activity) => {return activity;});
    console.log(act);
    switch(act.objectName){
        case "client":
            let client = await Client.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,client) => { return client});
            await undo.undoClient(client,req.session._id);
            req.flash('success',"Undo of the client was successful");
            break;
        case "invoice":
            let invoice = await Invoice.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,invoice) => { return invoice});
            await undo.undoInvoice(invoice,req.session._id);
            req.flash('success',"Undo of the invoice was successful");
            break;
        case "line":
            let order = await Order.findOne({_id:act.withObjectId,fromUser:req.session._id,isRemoved:true}, (err,order) => { return order});
            await undo.undoOrder(order,req.session._id);
            req.flash('success',"Undo of the line was successful");
            break;
        case "item":
            req.flash('success',"this url doesnt work yet");
            break;
    }
    await Activity.remove({_id:req.params.id,fromUser:req.session._id});
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
    await Activity.remove({_id:req.params.id,fromUser:req.session._id});
    req.flash('success',"Successfully deleted the activity");
    res.redirect('/activity');
};

exports.removePermanently = async (req,res) => {
    req.flash('warning',"This option is not available yet");
    res.redirect('back');
};