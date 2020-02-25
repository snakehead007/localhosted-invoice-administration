/**
 * @module controllers/invoiceController
 */

const Invoice = require("../models/invoice");
const Settings = require("../models/settings");
const Client = require("../models/client");
const Profile = require("../models/profile");
const Order = require("../models/order");
const {year} = require("../utils/date");
const User = require("../models/user");
const i18n = require("i18n");
const invoiceUtil = require("../utils/invoices");
const {findOneHasError, updateOneHasError} = require("../middlewares/error");
const {parseDateDDMMYYYY, parseDateSwapDayMonth} = require("../utils/date");
const {getFullNr} = require("../utils/invoices");
/**
 *
 * @param req
 * @param res
 */
exports.invoiceAllGet = (req, res) => {
    Invoice.find({fromUser: req.session._id}, null, {sort: {date: -1}}, function (err, invoices) {
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                res.render("invoices", {
                    "currentUrl": "invoices",
                    "invoices": invoices,
                    "profile": profile,
                    "settings": settings,
                    "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                        return user;
                    })).role
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
exports.invoiceNewChooseGet = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            Client.find({fromUser: req.session._id}, async (err, clients) => {
                res.render("add-file-no-contact", {
                    "profile": profile,
                    "settings": settings,
                    "add": "invoice",
                    "addlink": "invoice",
                    "clients": clients,
                    "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                        return user;
                    })).role
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
exports.offerNewChooseGet = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            Client.find({fromUser: req.session._id}, async (err, clients) => {
                res.render("add-file-no-contact", {
                    "profile": profile,
                    "settings": settings,
                    "add": "offer",
                    "addlink": "offer",
                    "clients": clients,
                    "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                        return user;
                    })).role
                });
            });
        })
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.creditNewChooseGet = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            Client.find({fromUser: req.session._id}, async (err, clients) => {
                let givenObjects = {
                    "profile": profile,
                    "settings": settings,
                    "add": "creditnote",
                    "addlink": "credit",
                    "clients": clients,
                    "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                        return user;
                    })).role
                };
                res.render("add-file-no-contact", givenObjects);
            });
        });
    });
};
/**
 *
 * @param req
 * @param res
 */
exports.invoiceNewGet = (req, res) => {
    const idc = (req.body.idc) ? req.body.idc : req.params.idc;
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Client.findOne({fromUser: req.session._id, _id: idc}, function (err, client) {
            if (client === null) {
                req.flash("danger", i18n.__("Cannot make an invoice with a client"));
                res.redirect("/invoice/new/invoice");
            } else {
                client.save(function (err) {
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        profile.save(function (err) {
                            Profile.updateOne({
                                fromUser: req.session._id
                            }, {
                                invoiceNrCurrent: profile.invoiceNrCurrent + 1
                            }, async function (err) {
                                let invoiceNr;
                                if (profile.invoiceNrCurrent.toString().length === 1) {
                                    invoiceNr = "00" + profile.invoiceNrCurrent.toString();
                                } else if (profile.invoiceNrCurrent.toString().length === 2) {
                                    invoiceNr = "0" + profile.invoiceNrCurrent.toString();
                                }
                                let newInvoice = new Invoice({
                                    fromClient: client._id,
                                    date: Date.now(),
                                    invoiceNr: String(new Date().getFullYear() + invoiceNr),
                                    clientName: client.clientName,
                                    total: 0,
                                    fromUser: req.session._id,
                                    description:""
                                });
                                await Client.findOne({
                                    fromUser: req.session._id,
                                    _id: client._id
                                }, async function (err) {
                                    if (!err) {
                                        client.invoices.push(newInvoice._id);
                                        await client.save();
                                    }
                                });
                                await newInvoice.save(function (err) {
                                    if (!err) {
                                        res.redirect("/invoice/all");
                                    }
                                });
                            });
                        });
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.creditNewGet = (req, res) => {
    const idc = (req.body.idc) ? req.body.idc : req.params.idc;
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Client.findOne({fromUser: req.session._id, _id: idc}, function (err, client) {
            if (client === null) {
                req.flash("danger", i18n.__("Cannot make an creditnote with a client"));
                res.redirect("/invoice/new/credit");
            } else {
                client.save(function (err) {
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        profile.save(function (err) {
                            Profile.updateOne(
                                {fromUser: req.session._id},
                                {creditNrCurrent: profile.creditNrCurrent + 1}, async function (err) {
                                    if (!err) {
                                        let creditNr = getFullNr(profile.creditNrCurrent);
                                        let newInvoice = new Invoice({
                                            fromClient: idc,
                                            date: Date.now(),
                                            creditNr: creditNr,
                                            clientName: client.clientName,
                                            total: 0,
                                            fromUser: req.session._id
                                        });
                                        await Client.findOne({
                                            fromUser: req.session._id,
                                            _id: client._id
                                        }, function (err) {
                                            client.invoices.push(newInvoice._id);
                                        });
                                        await newInvoice.save();
                                        res.redirect("/invoice/all");
                                    }
                                });
                        });
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.offerNewGet = (req, res) => {
    const idc = (req.body.idc) ? req.body.idc : req.params.idc;
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Client.findOne({fromUser: req.session._id, _id: idc}, function (err, client) {
            if (client === null) {
                req.flash("danger", i18n.__("Cannot make an offer with a client"));
                res.redirect("/invoice/new/offer");
            } else {
                client.save(function (err) {
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if (!err) {
                            profile.save(function (err) {
                                if (!err) {
                                    Profile.updateOne({
                                        fromUser: req.session._id
                                    }, {
                                        offerNrCurrent: profile.offerNrCurrent + 1
                                    }, async function (err) {
                                        if (!err) {
                                            let offerNr = getFullNr(profile.offerNrCurrent);
                                            let newInvoice = new Invoice({
                                                fromClient: idc,
                                                date: Date.now(),
                                                offerNr: offerNr,
                                                clientName: client.clientName,
                                                fromUser: req.session._id,
                                                description:""
                                            });
                                            await Client.findOne({
                                                fromUser: req.session._id,
                                                _id: client._id
                                            }, function (err) {
                                                client.invoices.push(newInvoice._id);
                                            });
                                            await newInvoice.save();
                                            if (!err) {
                                                res.redirect("/invoice/all");
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.invoiceAllClient = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc}, function (err, client) {
        Invoice.find({
            fromUser: req.session._id,
            fromClient: req.params.idc
        }).sort("-invoiceNr").exec(function (err, invoices) {
            Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                Profile.findOne({}, async (err, profile) => {
                    if (!err) {
                        let givenObject = {
                            "client": client,
                            "invoices": invoices,
                            "settings": settings,
                            "profile": profile,
                            "currentUrl": "invoiceClient",
                            "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                return user;
                            })).role
                        };
                        res.render("invoices", givenObject);
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
exports.editInvoiceGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                    console.log(invoice);
                    let givenObject = {
                        "invoice": invoice,
                        "client": client,
                        "settings": settings,
                        "profile": profile,
                        "currentUrl": "invoiceEdit",
                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                            return user;
                        })).role
                    };
                    res.render("edit/edit-invoice", givenObject);
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
exports.editInvoicePost = (req, res) => {
    console.log(req.body);
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi}, async (err, orders) => {
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, (err, invoice) => {
            return invoice
        });
        let updateInvoice;

        if (req.body.date && !req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (!req.body.date && req.body.datePaid) {
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                datePaid: parseDateDDMMYYYY(req.body.datePaid),
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (req.body.date && req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                datePaid: parseDateDDMMYYYY(req.body.datePaid),
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else {//both not changed
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        }
        let searchCriteria = {fromUser: req.session._id,};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient};
        }
        console.log(updateInvoice);
        Client.findOne(searchCriteria, function (err, contact) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, function (err) {
                if (!updateOneHasError(req, res, err)) {
                    req.flash("success", i18n.__("Successfully updated the invoice"));
                    res.redirect("/order/all/" + req.params.idi);
                }
            });
        });
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.viewInvoiceGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if (!findOneHasError(req, res, err, invoice)) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if (!findOneHasError(req, res, err, client)) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if (!findOneHasError(req, res, err, settings)) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if (!findOneHasError(req, res, err, profile)) {
                                    let description = (invoice.creditNr) ? "View credit of" : "View invoice of";
                                    let givenObject = {
                                        "invoice": invoice,
                                        "client": client,
                                        "description": i18n.__(description) + " " + client.clientName,
                                        "settings": settings,
                                        "currentUrl": "creditView",
                                        "profile": profile,
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            return user
                                        })).role
                                    };
                                    res.render("view/view-invoice", givenObject)
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
 */
exports.invoicePaidGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isPaid: !(invoice.isPaid),
                datePaid: Date.now(),
                lastUpdated: Date.now()
            }, function (err) {
                if (!updateOneHasError(req, res, err)) {
                    res.redirect("back");
                }
            });
        }
    });
};

exports.offerAgreedGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isAgreed: !(invoice.isAgreed),
                lastUpdated: Date.now()
            }, function (err) {
                if (!updateOneHasError(req, res, err)) {
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceUpgradeGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                invoiceNr: invoice.offerNr,
                offerNr: ""
            }, function (err) {
                if (!updateOneHasError(req, res, err)) {
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceDowngradeGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                offerNr: invoice.invoiceNr,
                invoiceNr: ""
            }, function (err) {
                if (!updateOneHasError(req, res, err)) {
                    res.redirect("back");
                }
            });
        }
    });
};