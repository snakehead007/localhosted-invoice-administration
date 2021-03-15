/**
 * @module controller/downloadController
 */

const Profile = require("../models/profile");
const Invoice = require("../models/invoice");
const Order = require("../models/order");
const Settings = require("../models/settings");
const Client = require("../models/client");
const i18n = require("i18n");
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
        error.handler(req,res,err,'4D0000');
        if (!error.findOneHasError(req, res, err, profile)) {
            Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
                error.handler(req,res,err,'4D0001');
                if (!error.findOneHasError(req, res, err, invoice)) {
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                        error.handler(req,res,err,'4D0002');
                        if (!error.findOneHasError(req, res, err, client)) {
                            Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                                error.handler(req,res,err,'4D0003');
                                Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                                    error.handler(req,res,err,'4D0004');
                                    if (!err) {
                                        try {
                                            const settings = await Settings.findOne({fromUser: req.session._id});
                                            console.log(settings.locale);
                                            i18n.setLocale(req, settings.locale);
                                            i18n.setLocale(res,settings.locale);
                                            req.setLocale(res,settings.locale);
                                            await activity.downloadInvoice(invoice,req.session._id);
                                            createPDF(req, res, "invoice", profile, settings, client, invoice, orders);
                                        } catch (err) {
                                            error.handler(req,res,err,'4D0005');
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
        error.handler(req,res,err,'4D0100');
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            error.handler(req,res,err,'4D0101');
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                error.handler(req,res,err,'4D0102');
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                    error.handler(req,res,err,'4D0103');
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        error.handler(req,res,err,'4D0104');
                        if (!err) {
                           try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "offer", profile, settings, client, invoice, orders);
                           } catch (err) {
                               error.handler(req,res,err,'4D0105');
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
        error.handler(req,res,err,'4D0200');
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            error.handler(req,res,err,'4D0201');
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                error.handler(req,res,err,'4D0202');
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                    error.handler(req,res,err,'4D0203');
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        error.handler(req,res,err,'4D0204');
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "credit", profile, settings, client, invoice, orders);
                            } catch (err) {
                                error.handler(req,res,err,'4D0205');
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
        error.handler(req,res,err,'4D0300');
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            error.handler(req,res,err,'4D0301');
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                error.handler(req,res,err,'4D0302');
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                    error.handler(req,res,err,'4D0303');
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        error.handler(req,res,err,'4D0304');
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "credit", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                error.handler(req,res,err,'4D0305');
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
        error.handler(req,res,err,'4D0400');
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            error.handler(req,res,err,'4D0401');
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                error.handler(req,res,err,'4D0401');
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                    error.handler(req,res,err,'4D0402');
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        error.handler(req,res,err,'4D0403');
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "invoice", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                error.handler(req,res,err,'4D0404');
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
        error.handler(req,res,err,'4D0500');
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            error.handler(req,res,err,'4D0501');
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                error.handler(req,res,err,'4D0502');
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id,isRemoved:false}, function (err, orders) {
                    error.handler(req,res,err,'4D0503');
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        error.handler(req,res,err,'4D0504');
                        if (!err) {
                            try{
                                await activity.downloadInvoice(invoice,req.session._id);
                                createPDF(req, res, "offer", profile, settings, client, invoice, orders,true);
                            } catch (err) {
                                error.handler(req,res,err,'4D0505');
                            }
                        }
                    });
                });
            });
        });
    });
};


