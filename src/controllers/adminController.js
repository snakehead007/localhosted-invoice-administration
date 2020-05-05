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
const invoiceUtils = require("../utils/invoices");
const i18n = require("i18n");
const Error = require('../middlewares/error');
const M = require('../utils/mongooseSchemas');
const Broadcast = require('../models/broadcast');
const {distinct} = require('../utils/array');

exports.getRemoveCreditsToUser = async (req,res) => {
  let user = await User.findOne({_id:req.params.idu});
  let credits = Number(req.query.credits);
  if(user.credits < credits){
      req.flash("warning","This user has only "+user.credits+" CR , you were trying to remove "+credits+" CR from it.");
  }else{
      await User.updateOne({_id:req.params.idu},{credits:user.credits-credits});
      req.flash("success","Successfully added "+credits+" CR to user");
  }
  res.redirect('back');
};

exports.getAddCreditsToUser = async (req,res) => {
    let user = await User.findOne({_id:req.params.idu});
    let credits = Number(req.query.credits);
    await User.updateOne({_id:req.params.idu},{credits:user.credits+credits});
    req.flash("success","Successfully added "+credits+" CR to user");
    res.redirect('back');
};

exports.getDeleteUserAndAllOfObjects = async (req,res) => {
    await User.deleteOne({_id:req.params.id});
    await Order.deleteMany({fromUser:req.params.id});
    await Invoice.deleteMany({fromUser:req.params.id});
    await Client.deleteMany({fromUser:req.params.id});
    req.flash('success','Successfully delete user and oll of its objects');
    res.redirect('back');
};

exports.invoiceDowngradeAdminGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is downgrading its invoice with id "+req.params.idi);
    Invoice.findOne({ _id: req.params.idi}, function (err, invoice) {
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot downgrade this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        Error.handler(req,res,err,'5C1700');
            Invoice.updateOne({ _id: req.params.idi}, {
                offerNr: invoice.invoiceNr,
                invoiceNr: ""
            }, async (err) => {
                Error.handler(req,res,err,'5C1701');
                    await Client.updateOne({_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=> {
                        Error.handler(req,res,err,'5C1702');});
                    res.redirect("back");

            });

    });
};

exports.invoiceUpgradeAdminGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is upgrading its offer with id "+req.params.idi);
    Invoice.findOne({_id: req.params.idi}, async (err, invoice) => {
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot upgrade this offer when it is already send'));
            res.redirect('back');
            return;
        }
        Error.handler(req,res,err,'5C1600');
            let profile = await Profile.findOne({fromUser:invoice.fromUser},(err,profile)=> {
                Error.handler(req,res,err,'5C1602');
                return profile;});
            let nr = invoiceUtils.getFullNr(profile.invoiceNrCurrent);
            Invoice.updateOne({ _id: req.params.idi}, {
                invoiceNr: nr ,
                offerNr: ""
            }, async (err) => {
                Error.handler(req,res,err,'5C1603');
                    await Client.updateOne({_id:invoice.fromClient},{lastUpdated:Date.now()},(err) => {
                        Error.handler(req,res,err,'5C1604');});
                    await Profile.updateOne({fromUser:invoice.fromUser},{invoiceNrCurrent:nr+1},(err) => {
                        Error.handler(req,res,err,'5C1605');});
                    res.redirect("back");

            });

    });
};

exports.getAllOrdersOfInvoiceAdmin = async (req,res) =>{
    let invoice = await Invoice.findOne({_id:req.params.idi});
    let orders = await Order.find({fromInvoice:req.params.idi});
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let title = "Orders of "+invoiceUtils.getOnlyTypeOfInvoice(invoice)+' '+invoiceUtils.getDefaultNumberOfInvoice(invoice)+((invoice.nickname)?" ("+invoice.nickname+")":"");
    res.render('admin/orders',
        {
            'settings':settings,
            'role':user.role,
            "credits":user.credits,
            'profile':profile,
            'currentUrl':"invoices",
            'orders':orders,
            'title':title
        }
    )
};

exports.getAllInvoicesOfClientAdmin = async (req,res) =>{
    let client = await Client.findOne({_id:req.params.idc});
    let invoices = await Invoice.find({fromClient:req.params.idc});
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    res.render('admin/invoices',
        {
            'settings':settings,
            'role':user.role,
            'profile':profile,
            "credits":user.credits,
            'currentUrl':"invoices",
            'invoices':invoices,
            'title':'invoices of '+client.clientName
        }
    )
};

exports.postCreateBroadcast = async (req,res)=>{
    let message = req.body.message;
    let type = req.body.type;
    await Broadcast.deleteMany();
    let newBroadcast = new Broadcast({
        type:type,
        message:message
    });
    await newBroadcast.save();
    req.flash('success','succesfully created broadcast');
    res.redirect('back');
};

exports.adminSearchGet = async (req, res) => {
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
    let str = req.body.search.toString().toLowerCase();
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' searching for \""+str+"\"");
    let clients = [];
    let invoices = [];
    let orders = [];
    let profiles = [];
    let users = [];
    let activities = [];
    let profiles_ = await new M.profile().find(req,res,{});
    let users_ = await new M.user().find(req,res,{});
    let activities_ = await new M.activity().find(req,res,{});

    for(let p of profiles_){
        if (String(p.firm).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.name).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.street).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.streetNr).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.postal).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.iban).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.bic).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.vat).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.invoiceNrCurrent).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.offerNrCurrent).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.tel).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.email).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.fromUser).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }else if (String(p.logoFile.contentType).toLowerCase().includes(str)) {
            profiles.push(profiles);
        }
    }

    for(let u of users_){
        if (String(u.name).toLowerCase().includes(str)) {
            users.push(profiles);
        }else if (String(u.googleId).toLowerCase().includes(str)) {
            users.push(profiles);
        }else if (String(u.email).toLowerCase().includes(str)) {
            users.push(profiles);
        }else if (String(u.role).toLowerCase().includes(str)) {
            users.push(profiles);
        }else if (String(u.settings).toLowerCase().includes(str)) {
            users.push(profiles);
        }else if (String(u.name).toLowerCase().includes(str)) {
            users.push(profiles);
        }
    }

    for(let a of activities_){
        if (String(a.type).toLowerCase().includes(str)) {
            activities.push(profiles);
        }else if (String(a.description).toLowerCase().includes(str)) {
            activities.push(profiles);
        }else if (String(a.fromUser).toLowerCase().includes(str)) {
            activities.push(profiles);
        }else if (String(a.withObjectId).toLowerCase().includes(str)) {
            activities.push(profiles);
        }else if (String(a.objectName).toLowerCase().includes(str)) {
            activities.push(profiles);
        }
    }

    Client.find({}, function (err, clients_) {
        Error.handler(req,res,err,'DS0000');
        Invoice.find({}, function (err, invoices_) {
            Error.handler(req,res,err,'DS0001');
            Order.find({}, function (err, orders_) {
                Error.handler(req,res,err,'DS0002');
                //orders
                for (let order of orders_) {
                    if (String(order.description).toLowerCase().includes(str)) {
                        orders.push(order);
                    }else if(String(order.amount).toLowerCase().includes(str)){
                        orders.push(order);
                    }else if(String(order.price).toLowerCase().includes(str)) {
                        orders.push(order);
                    }else if(String(order.total).toLowerCase().includes(str)) {
                        orders.push(order);
                    }else if(String(order.fromUser).toLowerCase().includes(str)) {
                        orders.push(order);
                    }else if(String(order.fromInvoice).toLowerCase().includes(str)) {
                        orders.push(order);
                    }else if(String(order.fromClient).toLowerCase().includes(str)) {
                        orders.push(order);
                    }
                }
                //invoices
                for (let invoice of invoices_) {
                    if (String(invoice.invoiceNr).includes(str)) {
                        invoices.push(invoice);
                    } else if (String(invoice.offerNr).includes(str)) {
                        invoices.push(invoice);
                    } else if (String(invoice.creditNr).includes(str)) {
                        invoices.push(invoice);
                    }else if (invoice.nickname){
                        if (invoice.nickname.includes(str))
                            invoices.push(invoice);
                    }else if (String(invoice.advance).includes(str)){
                        invoices.push(invoice);
                    }else if (invoice.firmName){
                        if(invoice.firmName.includes(str))
                            invoices.push(invoice);
                    }else if (invoice.clientName){
                        if(invoice.clientName.includes(str))
                            invoices.push(invoice);
                    }else if (String(invoice.total).includes(str)){
                        invoices.push(invoice);
                    }else if (String(invoice.fromClient).includes(str)){
                        invoices.push(invoice);
                    }else if (String(invoice.fromUser).includes(str)){
                        invoices.push(invoice);
                    }else if (invoice.description){
                        if(String(invoice.description).includes(str))
                            invoices.push(invoice);
                    }
                    for(let o of invoice.orders){
                        if (String(o).includes(str)){
                            invoices.push(invoice);
                        }
                    }
                }
                //clients
                for (let client of clients_) {
                    if (String(client.firm).toLowerCase().includes(str)) {
                        clients.push(client);
                    }else if (String(client.clientName).includes(str)) {
                        clients.push(client);
                    }else if (String(client.street).toLowerCase().includes(str)) {
                        clients.push(client);
                    }else
                    if (String(client.streetNr).toLowerCase().includes(str)) {
                        clients.push(client);
                    }else
                    if (String(client.postalCode).toLowerCase().includes(str)) {
                        clients.push(client);
                    }else
                    if (String(client.place).toLowerCase().includes(str)) {
                        clients.push(client);
                    }else if (String(client.vatPercentage).includes(str)) {
                        clients.push(client);
                    }else if (String(client.bankNr).includes(str)) {
                        clients.push(client);
                    }else if (String(client.fromUser).includes(str)) {
                        clients.push(client);
                    }else if (String(client.lang).includes(str)) {
                        clients.push(client);
                    }else if (String(client.totalPaid).includes(str)) {
                        clients.push(client);
                    }
                    for(let e of client.email){
                        if (String(e).includes(str)){
                            invoices.push(client);
                        }
                    }
                }
                //takes only 1 of each items, if found 2 or more of the same
                let users_d = distinct(users);
                let profiles_d = distinct(profiles);
                let activities_d = distinct(activities);
                let clients_d = distinct(clients);
                let orders_d = distinct(orders);
                let invoices_d = distinct(invoices);
                Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                    Error.handler(req,res,err,'DS0003');
                    if (!err) {
                        Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                            Error.handler(req,res,err,'DS0004');
                            if (!err) {
                                res.render('search', {
                                    "description": i18n.__("search on ") + "\"" + str + "\"",
                                    "settings": settings,
                                    "clients": clients_d,
                                    "orders": orders_d,
                                    "invoices": invoices_d,
                                    'users':users_d,
                                    'activities':activities_d,
                                    'profiles': profiles_d,
                                    "profile": profile,
                                    'credits': user.credits,
                                    "currentSearch": str,
                                    "role":user.role
                                });
                            }
                        });
                    }
                });
            });
        });
    });
};

exports.getSupportAdmingPage = async (req,res) => {
    req.flash('danger','We are currently working on this feature, will be available soon.');
    res.redirect('back');
};

exports.getDatabasePage = async (req,res) => {
    req.flash('danger','We are currently working on this feature, will be available soon.');
    res.redirect('back');
};

exports.getRemoveBroadcast = async (req,res) =>{
    await Broadcast.deleteOne({_id:req.params.id});
    req.flash('success','Successfull deleted broadcast');
    res.redirect('back');
};

exports.getBroadcastPage = async (req,res) => {
    let broadcast = await Broadcast.findOne({});
    let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    res.render('admin/broadcast',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
            'profile':profile,
            'currentUrl':"broadcast",
            'broadcast':broadcast
        }
    )
};

exports.getChangeRole = async (req,res) =>{
    let roleToChangeTo = req.params.role;
    let uid = req.params.uid;
    if(req.session._id===uid){
        req.flash('warning','You cannot change your own role');
        res.redirect('back');
        return;
    }
    await new M.user().updateOne(req,res,{_id:uid},{role:roleToChangeTo});
    req.flash('success','Succesfully changed role');
    res.redirect('back');

};

exports.postChangeNrCurrent = async (req,res) => {
    let nrCurrentType = req.body.nrCurrentType;
    let nrCurrent = req.body.nrCurrent;
    let profileId = req.params.pid;
    if(!nrCurrent||!nrCurrentType){
        req.flash('warning','Failed request, try again');
        res.redirect('back');
        return;
    }
    switch (nrCurrentType) {
        case 'credit':
            await Profile.updateOne({_id:profileId},{creditNrCurrent:nrCurrent});
            break;
        case 'invoice':
            await Profile.updateOne({_id:profileId},{invoiceNrCurrent:nrCurrent});
            break;
        case 'offer':
            await Profile.updateOne({_id:profileId},{offerNrCurrent:nrCurrent});
            break;
        default:
            req.flash('warning','Failed request, try again');
            res.redirect('back');
            return;
    }
    req.flash('success','succesfully updated!');
    res.redirect('back');
};

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
                isAgreed: !invoice.isAgreed,
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
        let isPaid = true; //can only set to true, not false
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is settings invoice paid status to "+isPaid+" for invoice with id: "+req.params.idi);
                    let invoiceUpdate;
            if(!invoice.datePaid){
                invoiceUpdate ={
                    isPaid: !invoice.isPaid,
                    datePaid: Date.now(),
                    lastUpdated: Date.now()
                };
            }else{
                invoiceUpdate ={
                    isPaid: !invoice.isPaid,
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
    if(currentUser.role==='admin' || currentUser.role==='support'){
        req.flash('warning','You cannot a view this user with '+currentUser.role+' as role');
        res.redirect('back');
        return;
    }
    let orders = await new M.order().find(req,res,{fromUser:req.params.uid});
    res.render('admin/orders',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
            'profile':profile,
            'currentUrl':"admin",
            'currentUser':currentUser,
            'orders':orders
        }
    )
};

exports.getRemovePermanent = async (req,res) => {
    req.flash('danger', 'We are currently working on this feature, will be available soon.');
    res.redirect('back');
};

exports.getRemoveActivity = async (req,res) => {
    req.flash('danger', 'We are currently working on this feature, will be available soon.');
    res.redirect('back');
};

exports.getSwitchRemoveClient = async (req,res) => {
    let client = await Client.findOne({_id:req.params.idc});
    let removedStatusNew = !client.isRemoved;
    let invoices = await Invoice.find({fromClient:req.params.idc});
    for(invoice of invoices){
        await Order.updateMany({fromInvoice:invoice._id},{isRemoved:removedStatusNew});
    }
    await Invoice.updateMany({fromClient:req.params.idc},{isRemoved:removedStatusNew});
    await Client.updateOne({_id:req.params.idc},{isRemoved:removedStatusNew});
    req.flash('success','succesfully made '+((removedStatusNew)?'remove':'undo'));
    res.redirect('back');
};

exports.getSwitchRemoveInvoice = async (req,res)=> {
    let invoice = await Invoice.findOne({_id:req.params.idi});
    let removedStatusNew = !invoice.isRemoved;
    await Order.updateMany({fromInvoice:req.params.idi},{isRemoved:removedStatusNew});
    await Invoice.updateOne({_id:req.params.idi},{isRemoved:removedStatusNew});
    req.flash('success','succesfully made '+((removedStatusNew)?'remove':'undo'));
    res.redirect('back');
};

exports.getSwitchRemoveOrder = async (req,res) => {
    let order = await Order.findOne({_id:req.params.ido});
    await Order.updateOne({_id:req.params.ido},{isRemoved:!order.isRemoved});
    req.flash('success','succesfully made '+((order.isRemoved)?'remove':'undo'));
    res.redirect('back');
};

exports.getUndoRemovedActivity = async (req,res) => {
    let act = await Activity.findOne({_id:req.params.id},(err,activity) => {
        Error.handler(req,res,err,'0A0200');return activity;});
    let user_id = act.fromUser;
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to undo a "+act.objectName);
    switch(act.objectName){
        case "client":
            let client = await Client.findOne({_id:act.withObjectId,fromUser:user_id,isRemoved:true}, (err,client) => {
                Error.handler(req,res,err,'0A0201');return client});
            await undo.undoClient(client,user_id);
            req.flash('success',i18n.__("Undo of the client was successful"));
            break;
        case "invoice":
            let invoice = await Invoice.findOne({_id:act.withObjectId,fromUser:user_id,isRemoved:true}, (err,invoice) => {
                Error.handler(req,res,err,'0A0202');return invoice});
            await undo.undoInvoice(invoice,user_id);
            if(invoice.isPaid) {
                await Client.findOne({
                    fromUser: user_id,
                    _id: invoice.fromClient
                }, async (err, client) => {
                    Error.handler(req,res,err,'0A0203');
                    await Client.updateOne({
                        fromUser: user_id,
                        _id: invoice.fromClient
                    }, {totalPaid: client.totalPaid+invoice.total}, (err) => {
                        Error.handler(req,res,err,'0A0204');
                    });
                });
            }
            req.flash('success',i18n.__("Undo of the invoice was successful"));
            break;
        case "line":
            let order = await Order.findOne({_id:act.withObjectId,fromUser:user_id,isRemoved:true}, (err,order) => {
                Error.handler(req,res,err,'0A0204');return order});
            console.log(act.withObjectId);
            let invoiceL = await Invoice.findOne({_id:order.fromInvoice,fromUser:user_id}, (err,invoice) => {
                Error.handler(req,res,err,'0A0205');return invoice});
            let updateInvoice = {
                total: invoiceL.total + (order.amount * order.price)
            };
            await Invoice.updateOne({fromUser: user_id, _id: invoiceL._id}, updateInvoice,(err) => {
                Error.handler(req,res,err,'0A0206');
            });
            if(invoiceL.isPaid) {
                await Client.findOne({
                    fromUser: user_id,
                    _id: invoiceL.fromClient
                }, async (err, client) => {
                    Error.handler(req,res,err,'0A0207');
                    await Client.updateOne({
                        fromUser: user_id,
                        _id: invoiceL.fromClient
                    }, {totalPaid: client.totalPaid + (order.amount * order.price)}, (err) => {
                        Error.handler(req,res,err,'0A0208');
                    });
                });
            }
            await undo.undoOrder(order,user_id);
            req.flash('success',i18n.__("Undo of the line was successful"));
            break;
        case "item":
            req.flash('success',i18n.__("this url doesnt work yet"));
            break;
    }
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is removing activity: "+JSON.stringify(act));
    await Activity.deleteOne({_id:req.params.id,fromUser:user_id},(err)=> {
        Error.handler(req,res,err,'0A0208');
    });
    res.redirect('back');
};

exports.getUserActivities = async (req,res) => {
    let settings = await new M.settings().findOne(req,res,{});
    let user = await new M.user().findOne(req,res,{_id:req.session._id});
    let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    if(currentUser.role==='admin' || currentUser.role==='support'){
        req.flash('warning','You cannot a view this user with '+currentUser.role+' as role');
        res.redirect('back');
        return;
    }
    let activities = await new M.activity().find(req,res,{fromUser:req.params.uid});
    res.render('admin/activities',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
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
    if(currentUser.role==='admin' || currentUser.role==='support'){
        req.flash('warning','You cannot a view this user with '+currentUser.role+' as role');
        res.redirect('back');
        return;
    }
    let invoices = await new M.invoice().find(req,res,{fromUser:req.params.uid});
    res.render('admin/invoices',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
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
    if(currentUser.role==='admin' || currentUser.role==='support'){
        req.flash('warning','You cannot a view this user with '+currentUser.role+' as role');
        res.redirect('back');
        return;
    }
    let clients = await new M.client().find(req,res,{fromUser:req.params.uid});
    res.render('admin/clients',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
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
    if(currentUser.role==='admin' || currentUser.role==='support'){
        req.flash('warning','You cannot a view this user with '+currentUser.role+' as role');
        res.redirect('back');
        return;
    }
    let currentProfile = await new M.profile().findOne(req,res,{fromUser:req.params.uid});
    res.render('admin/user',
        {
            'settings':settings,
            'role':user.role,
            'credits':user.credits,
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
        'credits':user.credits,
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
    let broadcast = await Broadcast.findOne({});
    res.render('admin/panel',{
        'settings':settings,
        'role':user.role,
        'credits':user.credits,
        'profile':profile,
        'currentUrl':"admin",
        'broadcast':broadcast
    });
};

exports.getUserBlock = async (req,res) => {
    if(req.session._id===req.params.uid){
        req.flash('warning','You cannot block yourself');
        res.redirect('back');
        return;
    }
    let currentUser = await new M.user().findOne(req,res,{_id:req.params.uid});
    await User.updateOne({_id:req.params.uid},{isBlocked:!currentUser.isBlocked});
    res.redirect('back');
};