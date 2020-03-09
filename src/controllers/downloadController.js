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
const activity = require('../utils/activity');
const logger = require("../middlewares/logger");
/**
 * @api {get} /stream/invoice/:idi streamInvoicePDF
 * @apiDescription Streams the pdf inline on the users browser
 * @apiName streamInvoicePDF
 * @apiGroup StreamRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.streamInvoicePDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on method Profile.findOne trace: "+err.message);
        if (!error.findOneHasError(req, res, err, profile)) {
            Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on method Invoice.findOne trace: "+err.message);
                if (!error.findOneHasError(req, res, err, invoice)) {
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on method Client.findOne trace: "+err.message);
                        if (!error.findOneHasError(req, res, err, client)) {
                            Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on method Order.find trace: "+err.message);
                                Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on method Settings.findOne trace: "+err.message);
                                    if (!err) {
                                        try {
                                            await activity.downloadInvoice(invoice,req.session._id);
                                            createPDF(req, res, "invoice", profile, settings, client, invoice, orders);
                                        } catch (err) {
                                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamInvoicePDF on catch block trace: "+err.message);
                                            req.flash("danger", i18n.__("Something went wrong, please try again"));
                                            req.redirect("back");
                                        }
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

/**
 * @api {get} /stream/offer/:idi streamOfferPDF
 * @apiDescription Streams the pdf inline on the users browser
 * @apiName streamOfferPDF
 * @apiGroup StreamRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.streamOfferPDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on method Order.findOne trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on method Settings.findOne trace: "+err.message);
                        if (!err) {
                           try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "offer", profile, settings, client, invoice, orders);
                           } catch (err) {
                               if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamOfferPDF on catch block trace: "+err.message);
                               req.flash("danger", i18n.__("Something went wrong, please try again"));
                               req.redirect("back");
                           }
                        }
                    });
                });
            });
        });
    });
};

/**
 * @api {get} /stream/credit/:idi streamCreditPDF
 * @apiDescription Streams the pdf inline on the users browser
 * @apiName streamCreditPDF
 * @apiGroup StreamRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.streamCreditPDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on method Order.find trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "credit", profile, settings, client, invoice, orders);
                            } catch (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on catch block trace: "+err.message);
                                req.flash("danger", i18n.__("Something went wrong, please try again"));
                                req.redirect("back");
                            }
                        }
                    });
                });
            });
        });
    });
};

/**
 * @api {get} /download/credit/:idi downloadCreditPDF
 * @apiDescription Prompts a download of the pdf inline on the users browser
 * @apiName downloadCreditPDF
 * @apiGroup DownloadRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.downloadCreditPDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadCreditPDF on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadCreditPDF on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadCreditPDF on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadCreditPDF on method Order.findOne trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadCreditPDF on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,fromUser);
                                createPDF(req, res, "credit", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on catch block trace: "+err.message);
                                req.flash("danger", i18n.__("Something went wrong, please try again"));
                                req.redirect("back");
                            }
                        }
                    });
                });
            });
        });
    });
};

/**
 * @api {get} /download/invoice/:idi downloadInvoicePDF
 * @apiDescription Prompts a download of the pdf inline on the users browser
 * @apiName downloadInvoicePDF
 * @apiGroup DownloadRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.downloadInvoicePDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadInvoicePDF on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadInvoicePDF on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadInvoicePDF on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadInvoicePDF on method Order.find trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadInvoicePDF on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "invoice", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on catch block trace: "+err.message);
                                req.flash("danger", i18n.__("Something went wrong, please try again"));
                                req.redirect("back");
                            }
                        }
                    });
                });
            });
        });
    });
};

/**
 * @api {get} /download/offer/:idi downloadOfferPDF
 * @apiDescription Prompts a download of the pdf inline on the users browser
 * @apiName downloadOfferPDF
 * @apiGroup DownloadRouter
 * @apiParamExample Request-Example:
 * {
 *    "idi": invoice._id
 * }
 */
exports.downloadOfferPDF = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadOfferPDF on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadOfferPDF on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadOfferPDF on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadOfferPDF on method Order.find trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.downloadOfferPDF on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "offer", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/downloadController.streamCreditPDF on catch block trace: "+err.message);
                                req.flash("danger", i18n.__("Something went wrong, please try again"));
                                req.redirect("back");
                            }
                        }
                    });
                });
            });
        });
    });
};


