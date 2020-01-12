const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Client = require('../models/client');
const Profile = require('../models/profile');
const Order = require('../models/order');
const {year} = require('../utils/date');
const i18n = require('i18n');

exports.invoice_all_get = (req,res) => {
    Invoice.find({fromUser:req.session._id}, function(err, invoices) {
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

exports.invoice_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({},function(err,clients){
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

exports.offer_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({},function(err,clients){
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

exports.credit_new_choose_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id},function(err,settings){
        if(err) console.trace();
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.trace();
            Client.find({},function(err,clients){
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

exports.invoice_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if(err) console.trace();
                client.save(function(err) {
                    if(err) console.trace();
                        Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                            if(err) console.trace();
                            profile.save(function(err) {
                                if(err) console.trace();
                                Profile.updateOne({fromUser:req.session._id,nr: profile.invoiceNrCurrent + 1}, function(err) {
                                    if(err) console.trace();
                                    let invoiceNr;
                                    if (profile.invoiceNrCurrent.toString().length === 1) {
                                        invoiceNr = "00" + profile.invoiceNrCurrent.toString();
                                    } else if (profile.invoiceNrCurrent.toString().length === 2) {
                                        invoiceNr = "0" + profile.invoiceNrCurrent.toString();
                                    }
                                    let newInvoice = new Invoice({
                                        fromClient: client._id,
                                        date: "20201010",
                                        invoiceNr: String(new Date().getFullYear() + invoiceNr),
                                        clientName: client.clientName,
                                        total: 0,
                                        datePaid: "20201001",
                                        fromUser:req.session._id
                                    });
                                    Client.updateOne({fromUser:req.session._id,}, function(err) {
                                        if(err) console.trace();
                                        if(!err){
                                            client.invoices.push(newInvoice._id);
                                        }
                                    });
                                    newInvoice.save(function(err){
                                        if(err) console.trace();
                                        if(!err){
                                            res.redirect('/invoice/all');
                                        }
                                    });
                                });
                            });
                        });
                });
        });
    });
};

exports.credit_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if(err) console.trace();
                client.save(function(err) {
                    if(err) console.trace();
                        Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                            profile.save(function(err) {
                                if(err) console.trace();
                                Profile.updateOne({fromUser:req.session._id,creditNrCurrent: profile.creditNrCurrent + 1}, function(err) {
                                    if(err) console.trace();
                                    if (!err){
                                        let nr_str;
                                        if (profile.creditNrCurrent.toString().length === 1) {
                                            nr_str = "00" + profile.creditNrCurrent.toString();
                                        } else if (profile.creditNrCurrent.toString().length === 2) {
                                            nr_str = "0" + profile.creditNrCurrent.toString();
                                        }
                                        let newInvoice = new Invoice({
                                            fromClient: client._id,
                                            date: "20200101",
                                            creditNr: String(year + nr_str),
                                            clientName: client.contactPersoon,
                                            total: 0,
                                            fromUser:req.session._id
                                        });
                                        Client.updateOne({fromUser:req.session._id}, function(err) {
                                            if(err) console.trace();
                                            client.invoices.push(newInvoice._id);
                                        });
                                        newInvoice.save();
                                        res.redirect('/invoice/all');
                                    }
                                });
                            });
                        });
                });
        });
    });
};

exports.offer_new_get = (req,res) => {
    const idc = (req.body.idc)?req.body.idc:req.params.idc;
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        Client.findOne({fromUser:req.session._id,_id: idc}, function(err, client) {
            if(err) console.trace();
                client.save(function(err) {
                    if(err) console.trace();
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if(err) console.trace();
                        if (!err) {
                            profile.save(function(err) {
                                if(err) console.trace();
                                if (!err) {
                                    Profile.updateOne({fromUser:req.session._id,nroff: profile.offerNrCurrent + 1}, function(err) {
                                        if(err) console.trace();
                                        if (!err) {
                                            let nr_str;
                                            if (profile.offerNrCurrent.toString().length == 1) {
                                                nr_str = "00" + profile.offerNrCurrent.toString();
                                            } else if (profile.offerNrCurrent.toString().length == 2) {
                                                nr_str = "0" + profile.offerNrCurrent.toString();
                                            }
                                            let newInvoice = new Invoice({
                                                fromClient: client._id,
                                                date: "20201010",
                                                offerNr: String(year + nr_str),
                                                clientName: client.clientName,
                                                fromUser:req.session._id
                                            });
                                            Client.updateOne({fromUser:req.session._id}, function(err) {
                                                if(err) console.trace();
                                                client.invoices.push(newInvoice._id);
                                            });
                                            newInvoice.save();
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
        });
    });
};

exports.invoice_all_client = (req,res) => {
    Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
        if(err) console.trace();
            Invoice.find({fromUser:req.session._id,fromClient: req.params.idc}).sort('-invoiceNr').exec(function(err, invoices) {
                if(err) console.trace();
                    Settings.findOne({}, function(err, settings) {
                        if(err) console.trace();
                        Profile.findOne({},function(err,profile){
                            if(err) console.trace();
                            if (!err) {
                                res.render('invoices', {
                                    'client': client,
                                    'invoices': invoices,
                                    "settings": settings,
                                    "profile":profile,
                                    "currentUrl": "invoicesClient"
                                });
                            }
                        });
                    });
            });
    });
};

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

exports.edit_invoice_post = (req,res) => {
    Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
        if(err) console.trace();
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += orders[i].total;
        }
        let updateInvoice;
        if (req.body.advance) {
            updateInvoice = {
                date: req.body.date,
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offer,
                datePaid: req.body.datePaid,
                total: totOrders - req.body.total
            };
        } else {
            updateInvoice = {
                date: req.body.date,
                invoice: req.body.invoice,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                datePaid: req.body.datePaid,
                total:totOrders
            };
        }
        Client.findOne({fromUser:req.session._id,_id:orders[0].fromClient}, function(err, contact) {
            Invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, updateInvoice, function(err) {
                if (!err) {
                    res.redirect('/invoice/' + contact._id);
                }
            });
        });
    });
};


exports.view_invoice_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if(err) console.trace(err);
        if (!err) {
            Client.findOne({fromUser:req.session._id,_id: invoice.fromClient}, function(err, client) {
                if(err) console.trace(err);
                Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                    if(err) console.trace(err);
                    if (!err){
                        Profile.findOne({fromUser:req.session._id},function(err,profile){
                        if(err) console.trace(err);
                            let description = (invoice.creditNr)? "View credit of":"View invoice of";
                            res.render('view/view-invoice', {
                                'invoice': invoice,
                                'client': client,
                                "description": i18n.__(description) + " " + client.clientName + " (" + invoice.invoiceNr + ")",
                                "settings": settings,
                                "currentUrl": "creditView",
                                "profile":profile
                            })
                        });
                    }
                });
            });
        }
    });
};
