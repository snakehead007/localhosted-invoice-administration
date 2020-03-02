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
/**
 *
 * @param req
 * @param res
 */
exports.editOrderGet = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        console.log(order);
        Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, function (err, invoice) {
            Settings.findOne({fromUser: req.session._id,}, function (err, settings) {
                Profile.findOne({fromUser: req.session._id,}, async (err, profile) => {
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
 *
 * @param req
 * @param res
 */
exports.newOrderGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        if (!err) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                console.log(invoice);
                                if (!err) {
                                    let sendObject = {
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "client": client,
                                        "currentUrl": "orderNew",
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            return user;
                                        })).role
                                    };
                                    res.render("new/new-order", sendObject);
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
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.newOrderPost = async (req, res) => {
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
        await newOrder.save();

        let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
        await Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
            total: totInvoice,
            lastUpdated: Date.now()
        }, function (err, invoice) {
            if (err) {
            }
        });
        activity.addOrder(newOrder,req.session._id);
        res.redirect("/order/all/" + req.params.idi);
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.allOrderGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        if (err) {
        }
        if (!err) {
            Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved: false}, function (err, orders) {
                if (!err) {
                    console.log("Trying to find Client with id: " + invoice);
                    Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                            if (!err) {
                                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                    if (!err) {
                                        console.log(invoice);
                                        let sendObject = {
                                            "invoice": invoice,
                                            "orders": orders,
                                            "profile": profile,
                                            "client": client,
                                            "settings": settings,
                                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                                return user;
                                            })).role
                                        };
                                        res.render("orders", sendObject);
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
 *
 * @param req
 * @param res
 */
exports.viewOrderGet = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        if (!err) {
            Invoice.findOne({fromUser: req.session._id, _id: order.factuur,isRemoved:false}, function (err, invoice) {
                if (!err) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if (!err) {
                                    let sendObject = {
                                        "order": order,
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            return user;
                                        })).role
                                    };
                                    res.render("view/view-order",);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.editOrderPost = (req, res) => {
    Order.findOne({fromUser: req.session._id, _id: req.params.ido,isRemoved:false}, function (err, order) {
        if (!findOneHasError(req, res, err, order)) {
            let updateOrder = {
                description: req.body.description,
                amount: req.body.amount,
                price: req.body.price,
                total: req.body.price * req.body.amount,
                lastUpdated: Date.now()
            };
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice,isRemoved:false}, async function (err, invoice) {
                await Order.updateOne({fromUser: req.session._id, _id: req.params.ido}, updateOrder);
                //total of the invoice minus old order total minus the advance
                let tot = invoice.total - (order.amount * order.price) - invoice.advance;
                let updateInvoice = {
                    //total of new invoice = total above + new total of order + the advance of the total
                    total: ((tot + (req.body.amount * req.body.price) + invoice.advance)),
                    lastUpdated: Date.now()
                };
                Invoice.updateOne({fromUser: req.session._id, _id: order.fromInvoice}, updateInvoice, function (err) {
                    activity.editedOrder(order,req.session._id);
                    res.redirect("/order/all/" + invoice._id);
                });
            });
        }
    });
};
