const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Client = require('../models/client');
const Profile = require('../models/profile');
const Order = require('../models/order');
const {year} = require('../utils/date');
exports.invoice_all_get = (req,res) => {
    Invoice.find({fromUser:req.session._id}, function(err, invoices) {
        if(err) console.log("[ERROR]: "+err);
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.log("[ERROR]: "+err);
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if(err) console.log("[ERROR]: "+err);
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
        if(err) console.log("[ERROR]: "+err);
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.log("[ERROR]: "+err);
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
        if(err) console.log("[ERROR]: "+err);
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.log("[ERROR]: "+err);
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
        if(err) console.log("[ERROR]: "+err);
        Profile.findOne({fromUser:req.session._id},function(err,profile){
            if(err) console.log("[ERROR]: "+err);
            Client.find({},function(err,clients){
                if(err) console.log("ERROR]: "+err);
                res.render('add-file-no-contact',{
                    'profile':profile,
                    'settings':settings,
                    'add':"credit",
                    'addlink':"credit",
                    'clients':clients
                });
            });
        })
    });
};

exports.invoice_new_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.log("[ERROR]: "+err);
        Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
            if(err) console.log("[ERROR]: "+err);
                client.save(function(err) {
                    if(err) console.log("[ERROR]: "+err);
                        Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                            if(err) console.log("[ERROR]: "+err);
                            profile.save(function(err) {
                                if(err) console.log("[ERROR]: "+err);
                                Profile.updateOne({fromUser:req.session._id,nr: profile.invoiceNrCurrent + 1}, function(err) {
                                    if(err) console.log("[ERROR]: "+err);
                                    let invoiceNr;
                                    if (profile.invoiceNrCurrent.toString().length === 1) {
                                        invoiceNr = "00" + profile.invoiceNrCurrent.toString();
                                    } else if (profile.invoiceNrCurrent.toString().length === 2) {
                                        invoiceNr = "0" + profile.invoiceNrCurrent.toString();
                                    }
                                    let newInvoice = new Invoice({
                                        fromClient: client._id,
                                        date: "20201010",
                                        invoiceNrCurrent: String(new Date().getFullYear() + invoiceNr),
                                        clientName: client.clientName,
                                        total: 0,
                                        datePaid: "20201001",
                                        fromUser:req.session._id
                                    });
                                    Client.updateOne({fromUser:req.session._id,}, function(err) {
                                        if(err) console.log("[ERROR]: "+err);
                                        if(!err){
                                            client.invoices.push(newInvoice._id);
                                        }
                                    });
                                    newInvoice.save(function(err){
                                        if(err) console.log("[ERROR]: "+err);
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
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.log("[ERROR]: "+err);
        client.findOne({fromUser:req.session._id,_id: req.body.idc}, function(err, client) {
            if(err) console.log("[ERROR]: "+err);
                client.save(function(err) {
                    if(err) console.log("[ERROR]: "+err);
                        Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                            profile.save(function(err) {
                                if(err) console.log("[ERROR]: "+err);
                                Profile.updateOne({fromUser:req.session._id,creditNrCurrent: profile.creditNrCurrent + 1}, function(err) {
                                    if(err) console.log("[ERROR]: "+err);
                                    if (!err){
                                        let nr_str;
                                        if (profile.creditNrCurrent.toString().length === 1) {
                                            nr_str = "00" + profile.creditNrCurrent.toString();
                                        } else if (profile.creditNrCurrent.toString().length === 2) {
                                            nr_str = "0" + profile.creditNrCurrent.toString();
                                        }
                                        let newInvoice = new Invoice({
                                            fromClient: contact._id,
                                            date: "20200101",
                                            creditNr: String(year + nr_str),
                                            clientName: contact.contactPersoon,
                                            total: 0,
                                            fromUser:req.session._id
                                        });
                                        Client.updateOne({fromUser:req.session._id}, function(err) {
                                            if(err) console.log("[ERROR]: "+err);
                                            client.invoices.push(newInvoice._id);
                                        });
                                        newInvoice.save();
                                        res.redirect('/invoices/all');
                                    }
                                });
                            });
                        });
                });
        });
    });
};

exports.offer_new_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.log("[ERROR]: "+err);
        Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
            if(err) console.log("[ERROR]: "+err);
                client.save(function(err) {
                    if(err) console.log("[ERROR]: "+err);
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if(err) console.log("[ERROR]: "+err);
                        if (!err) {
                            profile.save(function(err) {
                                if(err) console.log("[ERROR]: "+err);
                                if (!err) {
                                    Profile.updateOne({fromUser:req.session._id,nroff: profile.offerNrCurrent + 1}, function(err) {
                                        if(err) console.log("[ERROR]: "+err);
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
                                                if(err) console.log("[ERROR]: "+err);
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
        if(err) console.log("[ERROR]: "+err);
            Invoice.find({fromUser:req.session._id,fromClient: req.params.idc}).sort('-invoiceNr').exec(function(err, invoices) {
                if(err) console.log("[ERROR]: "+err);
                    Settings.findOne({}, function(err, settings) {
                        if(err) console.log("[ERROR]: "+err);
                        Profile.findOne({},function(err,profile){
                            if(err) console.log("[ERROR]: "+err);
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
        if(err) console.log("[ERROR]: "+err);
        Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client){
            if(err) console.log("[ERROR]: "+err);
            Settings.findOne({fromUser:req.session._id},function(err,settings){
                if(err) console.log("[ERROR]: "+err);
                Profile.findOne({fromUser:req.session._id},function(err,profile){
                    if(err) console.log("[ERROR]: "+err);
                    res.render('edit/edit-invoice',{
                    'invoice':invoice,
                    'client':client,
                    'settings':settings,
                    'profile':profile
                    });
                });
            });
        });
    });

};

exports.edit_invoice_post = (req,res) => {
    Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
        if(err) console.log("[ERROR]: "+err);
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