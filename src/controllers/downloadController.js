/**
 * @module controller/downloadController
 */

const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Settings = require('../models/settings');
const Client = require('../models/client');
const error = require('../middlewares/error');
const {callGetBase64,createJSON, replaceAll} =require('../utils/pdfCreation');

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
                    console.log("session._id " + req.session._id);
                    console.log("idi " + req.params.idi);
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                        if(!error.findOneHasError(req,res,err,client)) {
                            Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                                Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                                    if (!err) {
                                        callGetBase64(req.session._id).then(function (imgData) {
                                            res.render('pdf/pdf', {
                                                'profile': profile,
                                                'client': client,
                                                'orders': createJSON(orders),
                                                "invoice": invoice,
                                                'length': orders.length,
                                                "settings": settings,
                                                "invoiceText": replaceAll(settings.invoiceText, profile, client, invoice, settings.locale),
                                                "imgData": imgData,
                                                "vat": settings.vatPercentage
                                            });
                                        });
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
                            callGetBase64().then(function(imgData){
                                res.render('pdf/offer', {
                                    'profile': profile,
                                    'client': client,
                                    'orders': createJSON(orders),
                                    "invoice": invoice,
                                    'length': orders.length,
                                    "settings": settings,
                                    "offerText": replaceAll(settings.offerText,profile,client,invoice,settings.locale),
                                    "imgData":imgData,
                                    "vat":settings.vatPercentage
                                });
                            });
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
                            callGetBase64().then(function(imgData){
                                res.render('pdf/credit', {
                                    'profile': profile,
                                    'client': client,
                                    'orders': createJSON(orders),
                                    "invoice": invoice,
                                    'length': orders.length,
                                    "settings": settings,
                                    "creditText": replaceAll(settings.creditText,profile,client,invoice,settings.locale),
                                    "imgData":imgData,
                                    "vat":settings.vatPercentage
                                });
                            });
                        }
                    });
                });
            });
        });
    });
};
