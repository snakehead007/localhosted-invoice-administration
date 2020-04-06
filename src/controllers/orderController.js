/**
 * @module controllers/orderController
 */
const Order = require("../models/order");
const Invoice = require("../models/invoice");
const Settings = require("../models/settings");
const Profile = require("../models/profile");
const Client = require("../models/client");
const i18n = require("i18n");
const User = require("../models/user");
const {findOneHasError} = require("../middlewares/error");
const activity = require('../utils/activity');
const Error = require('../middlewares/error');
const logger = require("../middlewares/logger");
/**
 * @apiVersion 3.0.0
 * @api {get} /order/edit/:ido editOrderGet
 * @apiParam {String} ido unique id the order
 * @apiParamExample {String} title:
 "ido": order._id
 * @apiDescription shows a form where the user can edit an existing order
 * @apiName editOrderGet
 * @apiGroup OrderRouter
 * @apiSuccessExample Success-Response:
 *  res.render("edit/edit-order", {
            "order": order,
            "invoice": invoice,
            "profile": profile,
            "settings": settings,
            "role": role
        });
 */
exports.editOrderGet = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        Error.handler(req,res,err,'AO0000');
        Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, function (err, invoice) {
            if(invoice.isSend){
                req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
                res.redirect('back');
                return;
            }
            Error.handler(req,res,err,'AO0001');
            Settings.findOne({fromUser: req.session._id,}, function (err, settings) {
                Error.handler(req,res,err,'AO0002');
                Profile.findOne({fromUser: req.session._id,}, async (err, profile) => {
                    Error.handler(req,res,err,'AO0003');
                    if (!err) {
                        res.render("edit/edit-order", {
                            "order": order,
                            "invoice": invoice,
                            "profile": profile,
                            "settings": settings,
                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                Error.handler(req,res,err,'AO0004');
                                return user;
                            })).role
                        });
                    }
                });
            });
        });
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /order/new/:idi newOrderGet
 * @apiParam {String} idi unique id of the invoice where the order should be added to
 * @apiParamExample {String} title:
 "idi": invoice._id
 * @apiDescription show a form where you can add an order that will be added to a certain invoice
 * @apiName newOrderGet
 * @apiGroup OrderRouter
 * @apiSuccessExample Success-Response:
 *  res.render("new/new-order", {
        "invoice": invoice,
        "profile": profile,
        "settings": settings,
        "client": client,
        "currentUrl": "orderNew",
        "role": role
    });
 */
exports.newOrderGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        Error.handler(req,res,err,'AO0100');
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        if (!err) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                Error.handler(req,res,err,'AO0101');
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        Error.handler(req,res,err,'AO0102');
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                Error.handler(req,res,err,'AO0103');
                                if (!err) {
                                    res.render("new/new-order", {
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "client": client,
                                        "currentUrl": "orderNew",
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            Error.handler(req,res,err,'AO0104');
                                            return user;
                                        })).role
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

/**
 * @apiVersion 3.0.0
 * @api {post} /order/new/:idi newOrderPost
 * @apiParam {String} idi unique id of the invoice where the order should be added to
 * @apiParamExample {String} title:
 "idi": invoice._id
 * @apiDescription Adds an order to the given unique invoice
 * @apiName newOrderPost
 * @apiGroup OrderRouter
 * @apiSuccessExample Success-Response:
    res.redirect("/order/all/" + req.params.idi);
 */
exports.newOrderPost = async (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to add a new order to invoice with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, async function (err, invoice) {
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        let newOrder = new Order({
            description: req.body.description,
            amount: req.body.amount,
            price: req.body.price,
            total: req.body.amount * req.body.price,
            fromUser: req.session._id,
            fromClient: invoice.fromClient,
            fromInvoice: req.params.idi
        });
            invoice.orders.push(newOrder._id);
            await invoice.save();
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' new order contains "+JSON.stringify(newOrder));
        await newOrder.save((err) => {
            Error.handler(req,res,err,'AO0200');
        });
        let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
        await Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
            total: totInvoice,
            lastUpdated: Date.now()
        }, function (err, invoice) {
            Error.handler(req,res,err,'AO0201');
        });
        activity.addOrder(newOrder,req.session._id);
        res.redirect("/order/all/" + req.params.idi);
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /order/all/:idi allOrderGet
 * @apiParam {String} idi unique id of the invoice where we want to see all the orders from
 * @apiParamExample {String} title:
 "idi": invoice._id
 * @apiDescription Shows a form of the invoice where the user can edit the invoice, and shows all orders of that invoice in a table
 * @apiName allOrderGet
 * @apiGroup OrderRouter
 * @apiSuccessExample Success-Response:
     res.render("orders", {
        "invoice": invoice,
        "orders": orders,
        "profile": profile,
        "client": client,
        "settings": settings,
        "role": role
    });
 */
exports.allOrderGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        Error.handler(req,res,err,'AO0300');
        if (!err) {
            Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved: false}, function (err, orders) {
                Error.handler(req,res,err,'AO0301');
                if (!err) {
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                        if(err) {
                            Error.handler(req,res,err,'AO0302');
                        }
                        if(!client){
                            Error.handler(req,res,err,'AO0303',"Client has not been found of this document. If you have removed this, please undo the removal of this client manually. If this warning presists please file a bug report or contact us directly");
                        }
                        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                            Error.handler(req,res,err,'AO0304');
                            if (!err) {
                                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                    Error.handler(req,res,err,'AO0305');
                                    if (!err) {
                                        res.render("orders", {
                                            "invoice": invoice,
                                            "orders": orders,
                                            "profile": profile,
                                            "client": client,
                                            "settings": settings,
                                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                                Error.handler(req,res,err,'AO0306');
                                                return user;
                                            })).role
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /view/order/:ido viewOrderGet
 * @apiParam {String} ido unique id of the order where we want to see the order from
 * @apiParamExample {String} title:
 "ido": order._id
 * @apiDescription shows a table of the information of a specific order
 * @apiName viewOrderGet
 * @apiGroup ViewRouter
 * @apiSuccessExample Success-Response:
     res.render("view/view-order",{
        "order": order,
        "invoice": invoice,
        "profile": profile,
        "settings": settings,
        "role": role
    });
 */
exports.viewOrderGet = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        Error.handler(req,res,err,'AO0400');
        if (!err) {
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice,isRemoved:false}, function (err, invoice) {
                Error.handler(req,res,err,'AO0401');
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        Error.handler(req,res,err,'AO0402');
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                Error.handler(req,res,err,'AO0403');
                                if (!err) {
                                    res.render("view/view-order",{
                                        "order": order,
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            Error.handler(req,res,err,'AO0404');
                                            return user;
                                        })).role
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
/**
 * @apiVersion 3.0.0
 * @api {post} /order/edit/:ido editOrderPost
 * @apiParam {String} ido unique id of the order where we want to see the order from
 * @apiParamExample {String} title:
 "ido": order._id
 * @apiDescription Updates an exisiting order with new information
 * @apiName editOrderPost
 * @apiGroup OrderRouter
 * @apiSuccessExample Success-Response:
 res.redirect("/order/all/" + invoice._id);
 */
exports.editOrderPost = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is trying to edit order with id "+req.params.ido);
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        Error.handler(req,res,err,'AO0500');
        if (!findOneHasError(req, res, err, order)) {
            let updateOrder = {
                description: req.body.description,
                amount: req.body.amount,
                price: req.body.price,
                total: req.body.price * req.body.amount,
                lastUpdated: Date.now()
            };
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is updating order with "+JSON.stringify(updateOrder));
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice,isRemoved:false}, async function (err, invoice) {
                Error.handler(req,res,err,'AO0501');
                if(invoice.isSend){
                    req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
                    res.redirect('back');
                    return;
                }
                await Order.updateOne({fromUser: req.session._id, _id: req.params.ido}, updateOrder,(err)=>{
                    Error.handler(req,res,err,'AO0502');});
                //total of the invoice minus old order total minus the advance
                let tot = invoice.total - (order.amount * order.price) - invoice.advance;
                let updateInvoice = {
                    //total of new invoice = total above + new total of order + the advance of the total
                    total: ((tot + (req.body.amount * req.body.price) + invoice.advance)),
                    lastUpdated: Date.now()
                };
                Invoice.updateOne({fromUser: req.session._id, _id: order.fromInvoice}, updateInvoice, function (err) {
                    Error.handler(req,res,err,'AO0503');
                    activity.editedOrder(order,req.session._id);
                    res.redirect("/order/all/" + invoice._id);
                });
            });
        }
    });
};
