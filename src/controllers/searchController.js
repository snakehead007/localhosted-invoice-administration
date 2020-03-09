const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require("../models/order");
const Profile = require('../models/profile');
const Settings = require('../models/settings');
const {isNumeric} = require('../utils/numbers');
const {distinct} = require('../utils/array');
const i18n = require('i18n');
const User = require('../models/user');
const logger = require('../middlewares/logger');
/**
 * @apiVersion 3.0.0
 * @api {post} /search searchGet
 * @apiDescription Searches the string if it contains in Clients, Invoices and orders
 * @apiName searchGet
 * @apiGroup SearchRouter
 * @apiSuccessExample Success-Response:
 *  res.render('search', {
    "description": i18n.__("search on ") + "\"" + str + "\"",
    "settings": settings,
    "clients": clients_d,
    "orders": orders_d,
    "invoices": invoices_d,
    "items": items_d,
    "profile": profile,
    "currentSearch": str,
    "role":role
});
 */

module.exports.searchGet = (req, res) => {
    let str = req.body.search.toString().toLowerCase();
    logger.info.log("[INFO]: User "+req.session.email+" searching for \""+str+"\"");
    let clients = [];
    let invoices = [];
    let orders = [];
    Client.find({fromUser: req.session._id,isRemoved:false}, function (err, clients_) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/searchController.searchGet on method Client.find trace: "+err.message);
        Invoice.find({fromUser: req.session._id,isRemoved:false}, function (err, invoices_) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/searchController.searchGet on method Invoice.find trace: "+err.message);
            Order.find({fromUser: req.session._id,isRemoved:false}, function (err, orders_) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/searchController.searchGet on method Order.find trace: "+err.message);
                    //orders
                    for (let order of orders_) {
                        if (String(order.description).toLowerCase().includes(str)) {
                            orders.push(order);
                        }
                    }
                    //invoices
                    for (let invoice of invoices_) {
                        if (isNumeric(str)) {
                            if (String(invoice.invoiceNr).includes(str)) {
                                invoices.push(invoice);
                            } else if (String(invoice.offerNr).includes(str)) {
                                invoices.push(invoice);
                            } else if (String(invoice.creditNr).includes(str)) {
                                invoices.push(invoice);
                            }
                        }
                    }
                    //clients
                    for (let client of clients_) {
                        if (String(client.clientName).toLowerCase().includes(str)) {
                            clients.push(client);
                        }
                        if (String(client.postal).includes(str)) {
                            clients.push(client);
                        }
                        if (String(client.place).toLowerCase().includes(str)) {
                            clients.push(client);
                        }
                        if (String(client.mail).toLowerCase().includes(str)) {
                            clients.push(client);
                        }
                        if (String(client.firm).toLowerCase().includes(str)) {
                            clients.push(client);
                        }
                        if (String(client.street).toLowerCase().includes(str)) {
                            clients.push(client);
                        }
                    }
                    //takes only 1 of each items, if found 2 or more of the same
                    let clients_d = distinct(clients);
                    let orders_d = distinct(orders);
                    let invoices_d = distinct(invoices);
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/searchController.searchGet on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/searchController.searchGet on method Profile.findOne trace: "+err.message);
                                if (!err) {
                                    res.render('search', {
                                        "description": i18n.__("search on ") + "\"" + str + "\"",
                                        "settings": settings,
                                        "clients": clients_d,
                                        "orders": orders_d,
                                        "invoices": invoices_d,
                                        "profile": profile,
                                        "currentSearch": str,
                                        "role":(await User.findOne({_id: req.session._id}, (err, user) => {
                                            return user
                                        })).role
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
};