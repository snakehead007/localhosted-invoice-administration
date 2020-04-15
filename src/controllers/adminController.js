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

exports.switchSend = (req, res) => {
    Invoice.findOne({ _id: req.params.idi}, function (err, invoice) {
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is setting its isSend true for invoice with id "+req.params.idi);
        Error.handler(req,res,err,'5C1900');
        Invoice.updateOne({ _id: req.params.idi}, {
            isSend: !invoice.isSend,
            lastUpdated: Date.now(),
            sendDate: Date.now()
        }, async (err) => {
            Error.handler(req,res,err,'5C1901');
            res.redirect("back");
        });
    })
};

exports.offerAgreedGet = (req, res) => {
    Invoice.findOne({ _id: req.params.idi}, function (err, invoice) {
        Error.handler(req,res,err,'5C1400');
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is setting its offerAgreed to "+!(invoice.isAgreed)+" for invoice with id "+req.params.idi);
        //can only set agreed to true
            Invoice.updateOne({ _id: req.params.idi}, {
                isAgreed: true,
                lastUpdated: Date.now()
            }, async (err) => {
                Error.handler(req,res,err,'5C1401');
                    await Client.updateOne({_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=>{
                        Error.handler(req,res,err,'5C1402');
                    });
                    res.redirect("back");

            });
    });
};

exports.getPaid = async (req,res)=>{
    Invoice.findOne({_id: req.params.idi}, function (err, invoice) {
        Error.handler(req,res,err,'5C1300');
        if(!invoice.isSend){
            req.flash('warning',i18n.__('You cannot set invoice to paid, when it is not send'));
            res.redirect('back');
            return;
        }
        let isPaid = true; //can only set to true, not false
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is settings invoice paid status to "+isPaid+" for invoice with id: "+req.params.idi);
                    let invoiceUpdate;
            if(!invoice.datePaid){
                invoiceUpdate ={
                    isPaid: true,
                    datePaid: Date.now(),
                    lastUpdated: Date.now()
                };
            }else{
                invoiceUpdate ={
                    isPaid: true,
                    lastUpdated: Date.now()
                };
            Invoice.updateOne({_id: req.params.idi}, invoiceUpdate, async (err) =>  {
                Error.handler(req,res,err,'5C1301');
                    Error.handler(req,res,err,'5C1302');
                    let _client = await Client.findOne({_id:invoice.fromClient},(err,client) => {
                        Error.handler(req, res, err, '5C1303');
                        return client;
                    });
                    let newTotal = (isPaid)?_client.totalPaid+invoice.total:_client.totalPaid-invoice.total;
                    await Client.updateOne({_id:invoice.fromClient},{totalPaid:newTotal,lastUpdated:Date.now()},(err)=>{
                        Error.handler(req,res,err,'5C1304');
                    });
                    res.redirect("back");
            });
        }
    });
};

exports.getUserOrders = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    let orders = await new M.order().find(req,res,{fromUser:req.params.uid});
    res.render('admin/orders',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'orders':orders
        }
    )
};

exports.getUserActivities = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    let activities = await new M.activity().find(req,res,{fromUser:req.params.uid});
    res.render('admin/activities',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'activities':activities
        }
    )
};

exports.getUserInvoices = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    let invoices = await new M.invoice().find(req,res,{fromUser:req.params.uid});
    res.render('admin/invoices',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'invoices':invoices
        }
    )
};

exports.getUserClients = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    let clients = await new M.client().find(req,res,{fromUser:req.params.uid});
    res.render('admin/clients',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'clients':clients
        }
    )
};

exports.getUser = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    let currentProfile = await new M.profile().findOne(req,res,{fromUser:req.params.uid});
    res.render('admin/user',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'currentProfile':currentProfile
        }
    )
};

exports.getAllUser = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let allUsers = await new M.user().find(req,res,{});
    res.render('admin/users',
    {
        'settings':settings,
        'role':user.role,
        'profile':profile,
        'currentUrl':"admin",
        'users':allUsers
    }
    )
};

exports.getAdminPanel = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    res.render('admin/panel',{
        'settings':settings,
        'role':user.role,
        'profile':profile,
        'currentUrl':"admin"
    });
};

exports.getUserBlock = async (req,res) => {
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    await User.updateOne({_id:req.params.uid},{isBlocked:!currentUser.isBlocked});
    res.redirect('back');
};