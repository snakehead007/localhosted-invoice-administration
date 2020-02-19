/**
 * @module controllers/invoiceController
 */

const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Client = require('../models/client');
const Profile = require('../models/profile');
const Order = require('../models/order');
const {year} = require('../utils/date');
const i18n = require('i18n');
const invoiceUtil = require('../utils/invoices');
const {findOneHasError,updateOneHasError} = require('../middlewares/error');
/**
 *
 * @param req
 * @param res
 */
exports.invoice_all_get = (req,res) => {
    Invoice.find({fromUser:req.session._id},null,{sort:{date:-1}}, function(err, invoices) {
        if(err) console.trace();
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.trace();
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if(err) console.trace();
                            res.render('invoices', {
                                "currentUrl":"invoices",
                                'invoices': invoices,
                                "profile": profile,
                                "settings": settings,
                            });
                    });
            });
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.invoice_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({fromUser:req.session._id},function(err,clients){
                console.log(clients);
                if(err) console.log("ERROR]: "+err);
                res.render('add-file-no-contact',{
                   'profile':profile,
                   'settings':settings,
                   'add':"invoice",
                   'addlink':"invoice",
                   'clients':clients
                });
            });
        })
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.offer_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({fromUser:req.session._id},function(err,clients){
                if(err) console.log("ERROR]: "+err);
                res.render('add-file-no-contact',{
                    'profile':profile,
                    'settings':settings,
                    'add':"offer",
                    'addlink':"offer",
                    'clients':clients
                });
            });
        })
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.credit_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({fromUser:req.session._id},function(err,clients){
                if(err) console.log("ERROR]: "+err);
                res.render('add-file-no-contact',{
                    'profile':profile,
                    'settings':settings,
                    'add':"creditnote",
                    'addlink':"credit",
                    'clients':clients
                });
            });
        })
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.invoice_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if (client===null){
                req.flash('danger',i18n.__("Cannot make an invoice with a client"));
                res.redirect('/invoice/new/invoice');
            }else {
                if (err) console.trace();
                client.save(function (err) {
                    if (err) console.trace();
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if (err) console.trace();
                        profile.save(function (err) {
                            if (err) console.trace();
                            Profile.updateOne({
                                fromUser: req.session._id,
                                invoiceNrCurrent: profile.invoiceNrCurrent + 1
                            }, async function (err) {
                                if (err) console.trace(err);
                                console.log(profile);
                                let invoiceNr;
                                if (profile.invoiceNrCurrent.toString().length === 1) {
                                    invoiceNr = "00" + profile.invoiceNrCurrent.toString();
                                } else if (profile.invoiceNrCurrent.toString().length === 2) {
                                    invoiceNr = "0" + profile.invoiceNrCurrent.toString();
                                }
                                if(process.env.LOGGING>2){
                                    console.log("[DEBUG]: created invoice for "+client.clientName+" ("+client._id+")");
                                }
                                let newInvoice = new Invoice({
                                    fromClient: client._id,
                                    date: Date.now(),
                                    invoiceNr: String(new Date().getFullYear() + invoiceNr),
                                    clientName: client.clientName,
                                    total: 0,
                                    fromUser: req.session._id,
                                });
                                await Client.findOne({fromUser: req.session._id,_id:client._id}, async function (err) {
                                    if (err) console.trace();
                                    if (!err) {
                                        client.invoices.push(newInvoice._id);
                                        await client.save();
                                    }
                                });
                                await newInvoice.save(function (err) {
                                    if (err) console.trace();
                                    if (!err) {
                                        res.redirect('/invoice/all');
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.credit_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if (client===null){
                req.flash('danger',i18n.__("Cannot make an creditnote with a client"));
                res.redirect('/invoice/new/credit');
            }else {
                if (err) console.trace();
                client.save(function (err) {
                    if (err) console.trace();
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        profile.save(function (err) {
                            if (err) console.trace();
                            Profile.updateOne({
                                fromUser: req.session._id,
                                creditNrCurrent: profile.creditNrCurrent + 1
                            }, async function (err) {
                                if (err) console.trace();
                                if (!err) {
                                    let nr_str;
                                    if (profile.creditNrCurrent.toString().length === 1) {
                                        nr_str = "00" + profile.creditNrCurrent.toString();
                                    } else if (profile.creditNrCurrent.toString().length === 2) {
                                        nr_str = "0" + profile.creditNrCurrent.toString();
                                    }
                                    let newInvoice = new Invoice({
                                        fromClient: idc,
                                        date: Date.now(),
                                        creditNr: String(year + nr_str),
                                        clientName: client.clientName,
                                        total: 0,
                                        fromUser: req.session._id
                                    });
                                    await Client.findOne({fromUser: req.session._id,_id:client._id}, function (err) {
                                        if (err) console.trace();
                                        client.invoices.push(newInvoice._id);
                                    });
                                    await newInvoice.save();
                                    res.redirect('/invoice/all');
                                }
                            });
                        });
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.offer_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if (client===null){
                req.flash('danger',i18n.__("Cannot make an offer with a client"));
                res.redirect('/invoice/new/offer');
            }else {
                if (err) console.trace();
                client.save(function (err) {
                    if (err) console.trace();
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if (err) console.trace();
                        if (!err) {
                            profile.save(function (err) {
                                if (err) console.trace();
                                if (!err) {
                                    Profile.updateOne({
                                        fromUser: req.session._id,
                                        offerNrCurrent: profile.offerNrCurrent + 1
                                    }, async function (err) {
                                        if (err) console.trace();
                                        if (!err) {
                                            let nr_str;
                                            if (profile.offerNrCurrent.toString().length == 1) {
                                                nr_str = "00" + profile.offerNrCurrent.toString();
                                            } else if (profile.offerNrCurrent.toString().length == 2) {
                                                nr_str = "0" + profile.offerNrCurrent.toString();
                                            }
                                            let newInvoice = new Invoice({
                                                fromClient: idc,
                                                date: Date.now(),
                                                offerNr: String(year + nr_str),
                                                clientName: client.clientName,
                                                fromUser: req.session._id
                                            });
                                            await Client.findOne({fromUser: req.session._id,_id:client._id}, function (err) {
                                                if (err) console.trace();
                                                client.invoices.push(newInvoice._id);
                                            });
                                            await newInvoice.save();
                                            if (!err) {
                                                res.redirect('/invoice/all');
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.invoice_all_client = (req,res) => {
    Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
        if(err) console.trace();
            Invoice.find({fromUser:req.session._id,fromClient: req.params.idc}).sort('-invoiceNr').exec(function(err, invoices) {
                if(err) console.trace();
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if(err) console.trace();
                        Profile.findOne({},function(err,profile){
                            if(err) console.trace();
                            if (!err) {
                                res.render('invoices', {
                                    'client': client,
                                    'invoices': invoices,
                                    "settings": settings,
                                    "profile":profile,
                                    "currentUrl": "invoiceClient"
                                });
                            }
                        });
                    });
            });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.edit_invoice_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi},function(err,invoice){
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client){
            if(err) console.trace();
            Settings.findOne({fromUser:req.session._id},function(err,settings){
                if(err) console.trace();
                Profile.findOne({fromUser:req.session._id},function(err,profile){
                    if(err) console.trace();
                    res.render('edit/edit-invoice',{
                    'invoice':invoice,
                    'client':client,
                    'settings':settings,
                    'profile':profile,
                    'currentUrl':"invoiceEdit"
                    });
                });
            });
        });
    });

};

/**
 *
 * @param req
 * @param res
 */
exports.edit_invoice_post = (req,res) => {
    Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
        if(err) console.trace();
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price*orders[i].amount);
        }
        console.log(totOrders);
        let updateInvoice;
        updateInvoice = {
            date: Date.parse(req.body.date.replace(/[^0-9//]/g,"") ),
            invoiceNr: req.body.invoiceNr,
            advance: req.body.advance,
            offerNr: req.body.offer,
            datePaid: (req.body.datePaid.toString()!=="")?Date.parse(req.body.datePaid.replace(/[^0-9//]/g)):"",
            lastUpdated:Date.now(),
            total: totOrders - req.body.advance
        }
        let searchCriteria = {fromUser:req.session._id,};
        if(orders.length > 0) {
            console.log(orders);
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient};
        }
        console.log(searchCriteria);
        console.log(orders);
        console.log(updateInvoice);
        Client.findOne(searchCriteria, function(err, contact) {
            console.log(contact);
            Invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, updateInvoice, function(err) {
                if (!updateOneHasError(req,res,err)) {
                    req.flash('success',i18n.__("Successfully updated the invoice"));
                    res.redirect('/invoice/all');
                }
            });
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.view_invoice_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if (!findOneHasError(req,res,err,invoice)) {
            Client.findOne({fromUser:req.session._id,_id: invoice.fromClient}, function(err, client) {
                if(!findOneHasError(req,res,err,client)) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if (!findOneHasError(req,res,err,settings)) {
                            Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                                if(!findOneHasError(req,res,err,profile)) {
                                    let description = (invoice.creditNr) ? "View credit of" : "View invoice of";
                                    res.render('view/view-invoice', {
                                        'invoice': invoice,
                                        'client': client,
                                        "description": i18n.__(description) + " " + client.clientName + " (" + invoiceUtil.getDefaultNumberOfInvoice(invoice) + ")",
                                        "settings": settings,
                                        "currentUrl": "creditView",
                                        "profile": profile
                                    })
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.invoice_paid_set = (req,res) => {
        Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
            if (!findOneHasError(req,res,err,invoice)) {
                Invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, {isPaid: !(invoice.isPaid),datePaid: Date.now(),lastUpdated:Date.now()}, function(err) {
                    if (!updateOneHasError(req,res,err)) {
                        res.redirect('back');
                    }
                });
            }
        });
};

exports.invoice_upgrade_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi},function(err,invoice){
        if(!findOneHasError(req,res,err,invoice)){
            Invoice.updateOne({fromUser:req.session._id,_id:req.params.idi},{
                invoiceNr:invoice.offerNr,
                offerNr: ""
            },function(err){
                if(!updateOneHasError(req,res,err)){
                    res.redirect('back');
                }
            });
        }
    });
};

exports.invoice_downgrade_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi},function(err,invoice){
        if(!findOneHasError(req,res,err,invoice)){
            Invoice.updateOne({fromUser:req.session._id,_id:req.params.idi},{
                offerNr:invoice.invoiceNr,
                invoiceNr: ""
            },function(err){
                if(!updateOneHasError(req,res,err)){
                    res.redirect('back');
                }
            });
        }
    });
};