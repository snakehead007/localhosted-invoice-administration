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
        if (!error.findOneHasError(req, res, err, profile)) {
            Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
                if (!error.findOneHasError(req, res, err, invoice)) {
                    console.log(invoice);
                    console.log("idi " + req.params.idi);
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                        if (!error.findOneHasError(req, res, err, client)) {
                            Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                                console.log(orders);
                                Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                                    if (!err) {
                                        try {
                                            await activity.downloadInvoice(invoice,req.session._id);
                                            createPDF(req, res, "invoice", profile, settings, client, invoice, orders);

                                        } catch (err) {
                                            console.trace(err);
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
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {
                            await activity.downloadInvoice(invoice,req.session._id);
                            createPDF(req, res, "offer", profile, settings, client, invoice, orders);
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
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {
                            await activity.downloadInvoice(invoice,req.session._id);
                            createPDF(req, res, "credit", profile, settings, client, invoice, orders);
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
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {

                            await activity.downloadInvoice(invoice,fromUser);
                            createPDF(req, res, "credit", profile, settings, client, invoice, orders,true);
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
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {
                            await activity.downloadInvoice(invoice,req.session._id);
                            createPDF(req, res, "invoice", profile, settings, client, invoice, orders,true);
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
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {
                            await activity.downloadInvoice(invoice,req.session._id);
                            createPDF(req, res, "offer", profile, settings, client, invoice, orders,true);
                        }
                    });
                });
            });
        });
    });
};


