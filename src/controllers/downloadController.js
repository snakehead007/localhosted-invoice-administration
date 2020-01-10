const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Settings = require('../models/settings');
const Client = require('../models/client');
const {callGetBase64,createJSON} =require('../utils/pdfCreation');
exports.download_invoice_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
        Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
            Client.findOne({fromUser:req.session._id,_id: invoice.fromClient}, function(err, client) {
                Order.find({fromUser:req.session._id,fromInvoice: invoice._id}, function(err, orders) {
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if (!err){
                            callGetBase64().then(function(imgData){
                                res.render('pdf/pdf', {
                                    'profile': profile,
                                    'client': client,
                                    'orders': createJSON(orders),
                                    "invoice": invoice,
                                    'length': orders.length,
                                    "settings": settings,
                                    //"invoiceText": replaceAll(settings.invoice,profile,contact,factuur,settings.lang),
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

exports.download_offer_get = (req,res) => {

};

exports.download_credit_get = (req,res) => {

};
