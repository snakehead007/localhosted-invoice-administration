const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Item = require('../models/item');
const Order = require("../models/order");

module.exports.search_get = (req,res) => {
    let str = req.body.search.toString().toLowerCase();
    let clients = [];
    let invoices = [];
    let orders = [];
    let items = [];
    Client.find({}, function(err, clients_) {
        Invoice.find({}, function(err, invoices_) {
            Order.find({}, function(err, orders_) {
                Item.find({},function(err, mats_){
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
                    //items
                    if(!mats_.length == 0){
                        for (let mat of mats_){
                            let _mat = String(mat.naam).toLowerCase();
                            if(_mat.includes(str)){
                                items.push(mat);
                            }
                        }
                    }
                    //takes only 1 of each items, if found 2 or more of the same
                    let clients_d = distinct(clients);
                    let orders_d = distinct(orders);
                    let invoices_d = distinct(invoices);
                    let items_d = distinct(items);
                    Settings.findOne({}, function(err, settings) {
                        if (!err) {
                            Profile.findOne({}, function (err, profile) {
                                if (!err) {
                                    res.render(settings.lang + '/zoeken', {
                                        "description": "Zoeken op \"" + str + "\"",
                                        "settings": settings,
                                        "clients": clients_d,
                                        "orders": orders_d,
                                        "invoices": invoices_d,
                                        "items": items_d,
                                        "loginHash": req.params.loginHash,
                                        "profile": profile
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    });
};