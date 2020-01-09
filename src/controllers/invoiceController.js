const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Profile = require('../models/profile');
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
                req.render('add-file-no-contact',{
                   'profile':profile,
                   'settings':settings,
                   'add':'factuur',
                   'addlink':'invoice',
                   'contacten':clients
                });
            });
        })
    });
};

exports.invoice_new_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.log("[ERROR]: "+err);
        client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
            if(err) console.log("[ERROR]: "+err);
                contact.save(function(err) {
                    if(err) console.log("[ERROR]: "+err);
                        Profile.findOne({}, function(err, profile) {
                            if(err) console.log("[ERROR]: "+err);
                            profile.save(function(err) {
                                if(err) console.log("[ERROR]: "+err);
                                Profile.updateOne({fromUser:req.session._id,nr: profile.nr + 1}, function(err) {
                                    if(err) console.log("[ERROR]: "+err);
                                    let invoiceNr;
                                    if (profile.invoiceNrCurrent.toString().length === 1) {
                                        invoiceNr = "00" + profile.nr.toString();
                                    } else if (profile.invoiceNrCurrent.toString().length === 2) {
                                        invoiceNr = "0" + profile.invoiceNrCurrent.toString();
                                    }
                                    var newInvoice = new Invoice({
                                        client: client._id,
                                        date: getDatum(settings.lang),
                                        invoiceNrCurrent: String(new Date().getFullYear() + invoiceNr),
                                        clientName: contact.contactPersoon,
                                        total: 0,
                                        datePaid: Date.now()
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