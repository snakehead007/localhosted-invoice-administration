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
/**
 *
 * @param req
 * @param res
 */
exports.delete_client = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc}, async (err, client) => {
        await activity.deleteClient(client, req.session._id);
        req.flash("success", "Successfully deleted the client");
        res.redirect("/client/all");
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.delete_invoice_get = async (req, res) => {
    let invoice = await Invoice.findOne({_id:req.params.idi,fromUser:req.session._id,isRemoved:false}, async (err,invoice) => {return invoice;});
    console.log(invoice);
    await activity.deleteInvoice(invoice,req.session._id);
    res.redirect("/invoice/all");
};

exports.delete_logo_get = (req, res) => {
    let pathOfLogo = path.join(__dirname, "../../public/images/" + req.session._id + "/logo.jpeg");
    fs.access(pathOfLogo, fs.F_OK, (err) => {
        if (err) {
            req.flash("warning", i18n.__("There is no logo to delete"));
            res.redirect("/view/profile");
        } else {
            fs.unlink(pathOfLogo, async (err) => {
                if (err) {
                    req.flash("danger", i18n.__("Error, something went wrong"));
                    res.redirect("/view/profile");
                } else {
                    let updatedLogoFile = {
                        logoFile: null
                    };
                    await Profile.updateOne({fromUser: req.session._id}, updatedLogoFile, function (err) {
                        if (err) console.trace(err);
                    });
                    req.flash("success", i18n.__("Successfully deleted your current logo"));
                    res.redirect("/view/profile");

                }
            });
        }
    })
};

exports.delete_order_get = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido}, (err, order) => {
        if (!error.findOneHasError(req, res, err, order)) {
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, async (err, invoice) => {
                if (!error.findOneHasError(req, res, err, invoice)) {
                    let updateInvoice = {
                        total: invoice.total - (order.amount * order.price)
                    };
                    await Invoice.updateOne({fromUser: req.session._id, _id: invoice._id}, updateInvoice);
                    await activity.deleteOrder(order,req.session._id);
                    req.flash("success", i18n.__("Successfully deleted the order"));
                    res.redirect("/order/all/" + invoice._id);
                }
            })
        }
    })
};