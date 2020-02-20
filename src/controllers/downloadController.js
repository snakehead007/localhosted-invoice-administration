/**
 * @module controller/downloadController
 */

const Profile = require("../models/profile");
const Invoice = require("../models/invoice");
const Order = require("../models/order");
const Settings = require("../models/settings");
const Client = require("../models/client");
const error = require("../middlewares/error");
const {createPDF} = require("../utils/pdfGenerator");
const {callGetBase64,createJSON, replaceAll} =require("../utils/pdfCreation");

/**
 *
 * @param req
 * @param res
 */
exports.download_invoice_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
        if(!error.findOneHasError(req,res,err,profile)) {
            Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
                if(!error.findOneHasError(req,res,err,invoice)) {
                    console.log(invoice);
                    console.log("idi " + req.params.idi);
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                        if(!error.findOneHasError(req,res,err,client)) {
                            Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                                console.log(orders);
                                Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                                    if (!err) {
                                        try{
                                            createPDF(req,res,"invoice",profile,settings,client,invoice,orders);

                                        }catch(err){
                                            console.trace(err);
                                            req.flash("danger",i18n.__("Something went wrong, please try again"));
                                            req.redirect("back");
                                        }
                                            /*res.render("pdf/pdf", {
                                                "profile": profile,
                                                "client": client,
                                                "orders": createJSON(orders),
                                                "invoice": invoice,
                                                "length": orders.length,
                                                "settings": settings,
                                                "invoiceText": replaceAll(settings.invoiceText, profile, client, invoice, settings.locale),
                                                "imgData": imgData,
                                                "vat": settings.vatPercentage
                                            });*/
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.download_offer_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
        Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
            Client.findOne({fromUser:req.session._id,_id: invoice.fromClient}, function(err, client) {
                Order.find({fromUser:req.session._id,fromInvoice: invoice._id}, function(err, orders) {
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if (!err){

                            createPDF(req,res,"offer",profile,settings,client,invoice,orders);
                        }
                    });
                });
            });
        });
    });
};

exports.download_credit_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
        Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
            Client.findOne({fromUser:req.session._id,_id: invoice.fromClient}, function(err, client) {
                Order.find({fromUser:req.session._id,fromInvoice: invoice._id}, function(err, orders) {
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if (!err){

                            createPDF(req,res,"credit",profile,settings,client,invoice,orders);
                        }
                    });
                });
            });
        });
    });
};


