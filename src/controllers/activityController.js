const Activity = require('../models/activity');
const User = require('../models/user');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
const undo = require('../utils/undo');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Item = require('../models/item');

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

exports.remove = async (req,res)=> {
    await Activity.remove({_id:req.params.id,fromUser:req.session._id});
    req.flash('success',"Successfully deleted the activity");
    res.redirect('/activity');
};