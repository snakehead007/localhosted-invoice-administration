/**
 * @module controllers/orderController
 */
const Order = require("../models/order");
const Invoice = require("../models/invoice");
const Settings = require("../models/settings");
const Profile = require("../models/profile");
const Client = require("../models/client");

const User = require("../models/user");
const {findOneHasError} = require("../middlewares/error");
const activity = require('../utils/activity');
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderGet on method Order.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderGet on method Invoice.findOne trace: "+err.message);
            Settings.findOne({fromUser: req.session._id,}, function (err, settings) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderGet on method Settings.findOne trace: "+err.message);
                Profile.findOne({fromUser: req.session._id,}, async (err, profile) => {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderGet on method Profile.findOne trace: "+err.message);
                    if (!err) {
                        res.render("edit/edit-order", {
                            "order": order,
                            "invoice": invoice,
                            "profile": profile,
                            "settings": settings,
                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderGet on method Invoice.findOne trace: "+err.message);
        if (!err) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderGet on method Client.findOne trace: "+err.message);
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderGet on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderGet on method Profile.findOne trace: "+err.message);
                                if (!err) {
                                    res.render("new/new-order", {
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "client": client,
                                        "currentUrl": "orderNew",
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
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
    logger.info.log("[INFO]: User "+req.session.email+" trying to add a new order to invoice with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, async function (err, invoice) {
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
        logger.info.log("[INFO]: User "+req.session.email+" new order contains "+JSON.stringify(newOrder));
        await newOrder.save((err) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderPost on method newOrder.save trace: "+err.message);
        });
        let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
        await Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
            total: totInvoice,
            lastUpdated: Date.now()
        }, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.newOrderPost on method Invoice.updateOne trace: "+err.message);
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.allOrderGet on method Invoice.findOne trace: "+err.message);
        if (!err) {
            Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved: false}, function (err, orders) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.allOrderGet on method Order.findOne trace: "+err.message);
                if (!err) {
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.allOrderGet on method Client.findOne trace: "+err.message);
                        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.allOrderGet on method Settings.findOne trace: "+err.message);
                            if (!err) {
                                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.allOrderGet on method Profile.findOne trace: "+err.message);
                                    if (!err) {
                                        res.render("orders", {
                                            "invoice": invoice,
                                            "orders": orders,
                                            "profile": profile,
                                            "client": client,
                                            "settings": settings,
                                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.viewOrderGet on method Order.findOne trace: "+err.message);
        if (!err) {
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice,isRemoved:false}, function (err, invoice) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.viewOrderGet on method Invoice.findOne trace: "+err.message);
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.viewOrderGet on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.viewOrderGet on method Profile.findOne trace: "+err.message);
                                if (!err) {
                                    res.render("view/view-order",{
                                        "order": order,
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
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
    logger.info.log("[INFO]: User "+req.session.email+" is trying to edit order with id "+req.params.ido);
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderPost on method Order.findOne trace: "+err.message);
        if (!findOneHasError(req, res, err, order)) {
            let updateOrder = {
                description: req.body.description,
                amount: req.body.amount,
                price: req.body.price,
                total: req.body.price * req.body.amount,
                lastUpdated: Date.now()
            };
            logger.info.log("[INFO]: User "+req.session.email+" is updating order with "+JSON.stringify(updateOrder));
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice,isRemoved:false}, async function (err, invoice) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderPost on method Invoice.findOne trace: "+err.message);
                await Order.updateOne({fromUser: req.session._id, _id: req.params.ido}, updateOrder,(err)=>{
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderPost on method Order.updateOne trace: "+err.message);});
                //total of the invoice minus old order total minus the advance
                let tot = invoice.total - (order.amount * order.price) - invoice.advance;
                let updateInvoice = {
                    //total of new invoice = total above + new total of order + the advance of the total
                    total: ((tot + (req.body.amount * req.body.price) + invoice.advance)),
                    lastUpdated: Date.now()
                };
                Invoice.updateOne({fromUser: req.session._id, _id: order.fromInvoice}, updateInvoice, function (err) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/orderController.editOrderPost on method Invoice.updateOne trace: "+err.message);
                    activity.editedOrder(order,req.session._id);
                    res.redirect("/order/all/" + invoice._id);
                });
            });
        }
    });
};
