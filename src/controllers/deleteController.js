/**
 * @module controller/deleteController
 */

const Client = require("../models/client");
const Invoice = require("../models/invoice");
const Order = require("../models/order");
const Profile = require("../models/profile");
const fs = require("fs");
const i18n = require("i18n");
const path = require("path");
const error = require("../middlewares/error");
const activity = require("../utils/activity");
const logger = require("../middlewares/logger");
/**
 * @apiVersion 3.0.0
 * @api {get} /delete/client/:idc deleteClient
 * @apiDescription Deletes the client and redirects to /clients/all
 * @apiName deleteClient
 * @apiGroup DeleteRouter
 *  @apiParamExample Request-Example:
*  {
*     "idc": client._id
*  }
 */
exports.deleteClient = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc}, async (err, client) => {
        error.handler(req,res,err,'3D0000');
        await activity.deleteClient(client, req.session._id);
        req.flash("success", "Successfully deleted the client");
        res.redirect("/client/all");
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /delete/invoice/:idi deleteInvoiceGet
 * @apiDescription Deletes the invoice and redirects to /invoices/all
 * @apiName deleteInvoiceGet
 * @apiGroup DeleteRouter
 *  @apiParamExample Request-Example:
 *  {
 *     "idi": invoice._id
 *  }
 */
exports.deleteInvoiceGet = async (req, res) => {
    Invoice.findOne({_id:req.params.idi,fromUser:req.session._id,isRemoved:false}, async (err,invoice) => {
        error.handler(req,res,err,'3D0100');
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        if(invoice.isPaid) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, async (err, client) => {
                error.handler(req,res,err,'3D0101');
                await Client.updateOne({
                    fromUser: req.session._id,
                    _id: invoice.fromClient
                }, {totalPaid: client.totalPaid - invoice.total}, (err) => {
                    error.handler(req,res,err,'3D0102');
                });
            });
        }

        await activity.deleteInvoice(invoice, req.session._id);
        req.flash(i18n.__('succesfully removed'));
        res.redirect("/invoice/all");
        });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /delete/logo deleteLogoGet
 * @apiDescription Deletes the logo of the profile of the user in session and redirects to /clients/all
 * @apiName deleteClient
 * @apiGroup DeleteRouter
 * @apiError On error redirects to /view/profile and flashes error: "Error, something went wrong" or "There is no logo to delete"
 */
exports.deleteLogoGet = (req, res) => {
    let pathOfLogo = path.join(__dirname, "../../public/images/" + req.session._id + "/logo.jpeg");
    fs.access(pathOfLogo, fs.F_OK, (err) => {
        if (err) {
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried to remove logo, but had none uploaded");
            req.flash("warning", i18n.__("There is no logo to delete"));
            res.redirect("/view/profile");
        } else {
            fs.unlink(pathOfLogo, async (err) => {
                if (err) {
                    error.handler(req,res,err,'3D0200');
                    res.redirect("/view/profile");
                } else {
                    let updatedLogoFile = {
                        logoFile: null
                    };
                    await Profile.updateOne({fromUser: req.session._id}, updatedLogoFile, function (err) {
                        error.handler(req,res,err,'3D0201');
                    });
                    req.flash("success", i18n.__("Successfully deleted your current logo"));
                    res.redirect("/view/profile");
                }
            });
        }
    })
};
/**
 * @apiVersion 3.0.0
 * @api {get} /delete/order/:ido deleteClient
 * @apiDescription Deletes the order of an invoice and redirects to /order/all
 * @apiName deleteOrderGet
 * @apiGroup DeleteRouter
 * @apiParamExample Request-Example:
 * {
 *    "ido": order._id
 * }
 */
exports.deleteOrderGet = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido}, (err, order) => {
        error.handler(req,res,err,'3D0300');
        if (!error.findOneHasError(req, res, err, order)) {
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, async (err, invoice) => {
                error.handler(req,res,err,'3D0301');
                if(invoice.isSend){
                    req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
                    res.redirect('back');
                    return;
                }
                if (!error.findOneHasError(req, res, err, invoice)) {
                    let updateInvoice = {
                        total: invoice.total - (order.amount * order.price)
                    };
                    await Invoice.updateOne({fromUser: req.session._id, _id: invoice._id}, updateInvoice,(err) => {
                        error.handler(req,res,err,'3D0302');
                    });
                    if(invoice.isPaid) {
                        await Client.findOne({
                            fromUser: req.session._id,
                            _id: invoice.fromClient
                        }, async (err, client) => {
                            error.handler(req,res,err,'3D0303');
                            await Client.updateOne({
                                fromUser: req.session._id,
                                _id: invoice.fromClient
                            }, {totalPaid: client.totalPaid - (order.amount * order.price)}, (err) => {
                                error.handler(req,res,err,'3D0304');
                            });
                        });
                    }
                    await activity.deleteOrder(order,req.session._id);
                    req.flash("success", i18n.__("Successfully deleted the order"));
                    res.redirect("/order/all/" + invoice._id);
                }
            })
        }
    })
};
