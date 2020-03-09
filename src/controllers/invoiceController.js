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
const {parseDateDDMMYYYY, parseDateSwapDayMonth,parseDate} = require("../utils/date");
const {getFullNr} = require("../utils/invoices");
const activity = require('../utils/activity');
const logger = require("../middlewares/logger");
/**
 *
 * @param req
 * @param res
 */
exports.invoiceAllGet = (req, res) => {
    Invoice.find({fromUser: req.session._id,isRemoved:false}, null, {sort: {date: -1}}, function (err, invoices) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllGet on method Invoice.find trace: "+err.message);
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllGet on method Settings.findOne trace: "+err.message);
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllGet on method Profile.findOne trace: "+err.message);
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewChooseGet on method Settings.findOne trace: "+err.message);
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewChooseGet on method Profile.findOne trace: "+err.message);
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewChooseGet on method Client.find trace: "+err.message);
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewChooseGet on method Settings.findOne trace: "+err.message);
        Profile.findOne({fromUser: req.session._id,isRemoved:false}, function (err, profile) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewChooseGet on method Profile.findOne trace: "+err.message);
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewChooseGet on method Client.find trace: "+err.message);
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewChooseGet on method Settings.findOne trace: "+err.message);
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewChooseGet on method Profile.findOne trace: "+err.message);
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewChooseGet on method Client.findOne trace: "+err.message);
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
    logger.info.log("[INFO]: User "+req.session.email+" trying to create new invoice using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Settings.findOne trace: "+err.message);
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Client.findOne trace: "+err.message);
            if (client === null) {
                logger.info.log("[INFO]: User "+req.session.email+" tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an invoice with a client"));
                res.redirect("/invoice/new/invoice");
            } else {
                client.save(function (err) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Client.save trace: "+err.message);
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Profile.findOne trace: "+err.message);
                        profile.save(function (err) {
                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Profile.save trace: "+err.message);
                            Profile.updateOne({
                                fromUser: req.session._id
                            }, {
                                invoiceNrCurrent: profile.invoiceNrCurrent + 1
                            }, async function (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Profile.UpdateOne trace: "+err.message);
                                if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.invoiceNrCurrent+1);
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
                                    description:"",
                                    isRemoved:false
                                });
                                logger.info.log("[INFO]: User "+req.session.email+" trying to create new invoice with : "+JSON.stringify(newInvoice));
                                await Client.findOne({
                                    fromUser: req.session._id,
                                    _id: client._id,isRemoved:false
                                }, async function (err) {
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Client.findOne trace: "+err.message);
                                    if (!err) {
                                        client.invoices.push(newInvoice._id);
                                        await client.save((err)=>{
                                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Client.save trace: "+err.message);
                                        });
                                    }
                                });
                                await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method Client.UpdateOne trace: "+err.message);
                                });
                                await newInvoice.save(function (err) {
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceNewGet on method newInvoice.save trace: "+err.message);
                                    if (!err) {
                                        activity.addInvoice(newInvoice,req.session._id);
                                        res.redirect("/order/all/"+newInvoice._id);
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
    logger.info.log("[INFO]: User "+req.session.email+" trying to create new creditnote using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Settings.findOne trace: "+err.message);
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Client.findOne trace: "+err.message);
            if (client === null) {
                logger.info.log("[INFO]: User "+req.session.email+" tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an creditnote with a client"));
                res.redirect("/invoice/new/credit");
            } else {
                client.save(function (err) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Client.save trace: "+err.message);
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Profile.findOne trace: "+err.message);
                        profile.save(function (err) {
                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Profile.save trace: "+err.message);
                            Profile.updateOne(
                                {fromUser: req.session._id},
                                {creditNrCurrent: profile.creditNrCurrent + 1}, async function (err) {
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Profile.UpdateOne trace: "+err.message);
                                    if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.invoiceNrCurrent+1);
                                    if (!err) {
                                        let creditNr = getFullNr(profile.creditNrCurrent);
                                        let newInvoice = new Invoice({
                                            fromClient: idc,
                                            date: Date.now(),
                                            creditNr: creditNr,
                                            clientName: client.clientName,
                                            total: 0,
                                            fromUser: req.session._id
                                            ,isRemoved:false
                                        });
                                        logger.info.log("[INFO]: User "+req.session.email+" trying to create new invoice with : "+JSON.stringify(newInvoice));
                                        await Client.findOne({
                                            fromUser: req.session._id,
                                            _id: client._id,isRemoved:false
                                        }, function (err) {
                                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Client.findOne trace: "+err.message);
                                            client.invoices.push(newInvoice._id);
                                        });
                                        await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method Client.updateOne trace: "+err.message);
                                        });
                                        await newInvoice.save((err)=>{
                                            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.creditNewGet on method newInvoice.save trace: "+err.message);
                                        });
                                        activity.addCredit(newInvoice,req.session._id);
                                        res.redirect("/order/all/"+newInvoice._id);
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
    logger.info.log("[INFO]: User "+req.session.email+" trying to create new offer using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Settings.findOne trace: "+err.message);
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Client.findOne trace: "+err.message);
            if (client === null) {
                logger.info.log("[INFO]: User "+req.session.email+" tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an offer with a client"));
                res.redirect("/invoice/new/offer");
            } else {
                client.save(function (err) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Client.save trace: "+err.message);
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Profile.findOne trace: "+err.message);
                        if (!err) {
                            profile.save(function (err) {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Profile.save trace: "+err.message);
                                if (!err) {
                                    Profile.updateOne({
                                        fromUser: req.session._id
                                    }, {
                                        offerNrCurrent: profile.offerNrCurrent + 1
                                    }, async function (err) {
                                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Profile.UpdateOne trace: "+err.message);
                                        if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.invoiceNrCurrent+1);
                                        if (!err) {
                                            let offerNr = getFullNr(profile.offerNrCurrent);
                                            let newInvoice = new Invoice({
                                                fromClient: idc,
                                                date: Date.now(),
                                                offerNr: offerNr,
                                                clientName: client.clientName,
                                                fromUser: req.session._id,
                                                description:"",isRemoved:false
                                            });
                                            logger.info.log("[INFO]: User "+req.session.email+" trying to create new invoice with : "+JSON.stringify(newInvoice));
                                            await Client.findOne({
                                                fromUser: req.session._id,
                                                _id: client._id,isRemoved:false
                                            }, function (err) {
                                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Client.findOne trace: "+err.message);
                                                client.invoices.push(newInvoice._id);
                                            });
                                            await newInvoice.save((err)=>{
                                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method newInvoice.save trace: "+err.message);
                                            });
                                            await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerNewGet on method Client.updateOne trace: "+err.message);
                                            });
                                            if (!err) {
                                                activity.addOffer(newInvoice,req.session._id);
                                                res.redirect("/order/all/"+newInvoice._id);
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
    Client.findOne({fromUser: req.session._id, _id: req.params.idc,isRemoved:false}, function (err, client) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllClient on method Client.findOne trace: "+err.message);
        Invoice.find({
            fromUser: req.session._id,
            fromClient: req.params.idc,isRemoved:false
        }).sort("-invoiceNr").exec(function (err, invoices) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllClient on method Invoice.find trace: "+err.message);
            Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllClient on method Settings.findOne trace: "+err.message);
                Profile.findOne({fromUser:req.session._id}, async (err, profile) => {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceAllClient on method Profile.findOne trace: "+err.message);
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
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoiceGet on method Invoice.findOne trace: "+err.message);
        Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoiceGet on method Client.findOne trace: "+err.message);
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoiceGet on method Settings.findOne trace: "+err.message);
                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoiceGet on method Profile.findOne trace: "+err.message);
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
    logger.info.log("[INFO]: User "+req.session.email+" trying to edit invoice with: "+JSON.stringify(req.body));
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved:false}, async (err, orders) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Order.find trace: "+err.message);
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Settings.findOne trace: "+err.message);
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, (err, invoice) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Invoice.findOne trace: "+err.message);
            return invoice
        });
        if(!req.body.invoiceNr||!req.body.date){
            logger.info.log("[INFO]: User "+req.session.email+" tried editing invoice but no date or invoiceNr were given");
            req.flash('danger',i18n.__("Please fill in all the required fields"));
            res.redirect('back');
            return;
        }
        if(currentInvoice.isPaid){
            if(!req.body.datePaid||req.body.datePaid!== parseDate(currentInvoice.datePaid)) {
                logger.info.log("[INFO]: User "+req.session.email+" tried editing the invoice's datePaid but isPaid is turned on");
                req.flash('danger', i18n.__("Change this invoice to unpaid first, to remove its pay date."));
                res.redirect('back');
                return;
            }
        }
        if(await invoiceUtil.isInvoiceNrAlreadyInUse(req.body.invoiceNr,req.session._id)){
            logger.info.log("[INFO]: User "+req.session.email+" tried editing the invoiceNr "+req.body.invoiceNr+", but it is already taken.");
            req.flash('danger',i18n.__("This invoice number is already in use."));
            res.redirect('back');
            return;
        }
        let datePaid = (req.body.datePaid)?parseDateDDMMYYYY(req.body.datePaid):"";
        let updateInvoice;
        if (req.body.date) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                datePaid:datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (!req.body.date) {
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (req.body.date && req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else {
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        }
        logger.info.log("[INFO]: User "+req.session.email+" is updating the invoice with: "+JSON.stringify(updateInvoice));
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        Client.findOne(searchCriteria, function (err, client) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Client.findOne trace: "+err.message);
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Update.findone trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editInvoicePost on method Client.updateOne trace: "+err.message);
                    });
                    activity.editedInvoice(updateInvoice,req.session._id);
                    req.flash("success", i18n.__("Successfully updated the invoice"));
                    res.redirect("back");
                }
            });
        });
    });
};

exports.editOfferPost = (req, res) => {
    logger.info.log("[INFO]: User "+req.session.email+" trying to edit offer with: "+JSON.stringify(req.body));
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved:false}, async (err, orders) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Order.find trace: "+err.message);
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Settings.findOne trace: "+err.message);
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, (err, invoice) => {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Invoice.findOne trace: "+err.message);
            return invoice
        });
        if(!req.body.offerNr||!req.body.date){
            logger.info.log("[INFO]: User "+req.session.email+" tried editing offer but no date or invoiceNr were given");
            req.flash('danger',i18n.__("Please fill in all the required fields"));
            res.redirect('back');
            return;
        }
        if(currentInvoice.isPaid){
            if(!req.body.datePaid||req.body.datePaid!== parseDate(currentInvoice.datePaid)) {
                logger.info.log("[INFO]: User "+req.session.email+" tried editing the offer's datePaid but isPaid is turned on");
                req.flash('danger', i18n.__("Change this invoice to unpaid first, to remove its pay date."));
                res.redirect('back');
                return;
            }
        }
        if(await invoiceUtil.isOfferNrAlreadyInUse(req.body.offerNr,req.session._id)){
            logger.info.log("[INFO]: User "+req.session.email+" tried editing the offerNr "+req.body.offerNr+", but it is already taken.");
            req.flash('danger',i18n.__("This invoice number is already in use."));
            res.redirect('back');
            return;
        }
        let datePaid = (req.body.datePaid)?parseDateDDMMYYYY(req.body.datePaid):"";
        let updateInvoice;
        if (req.body.date) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                datePaid:datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (!req.body.date) {
            updateInvoice = {
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else if (req.body.date && req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        } else {
            updateInvoice = {
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description
            };
        }
        logger.info.log("[INFO]: User "+req.session.email+" is updating the offer with: "+JSON.stringify(updateInvoice));
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        Client.findOne(searchCriteria, function (err, contact) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()});
                    activity.editedInvoice(updateInvoice,req.session._id);
                    req.flash("success", i18n.__("Successfully updated the offer"));
                    res.redirect("back");
                }
            });
        });
    });
};

exports.editCreditPost = (req, res) => {
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved:false}, async (err, orders) => {
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, (err, invoice) => {
            return invoice
        });
        if(!req.body.creditNr||!req.body.date){
            req.flash('danger',i18n.__("Please fill in all the required fields"));
            res.redirect('back');
            return;
        }
        if(currentInvoice.isPaid){
            if(!req.body.datePaid||req.body.datePaid!== parseDate(currentInvoice.datePaid)) {
                req.flash('danger', i18n.__("Change this invoice to unpaid first, to remove its pay date."));
                res.redirect('back');
                return;
            }
        }
        if(await invoiceUtil.isCreditNrAlreadyInUse(req.body.creditNr,req.session._id)){
            req.flash('danger',i18n.__("This invoice number is already in use."));
            res.redirect('back');
            return;
        }
        let datePaid = (req.body.datePaid)?parseDateDDMMYYYY(req.body.datePaid):"";
        let updateInvoice;
        updateInvoice = {
            creditNr: req.body.creditNr,
            date:req.body.date,
            advance: req.body.advance,
            offerNr: req.body.offerNr,
            lastUpdated: Date.now(),
            total: totOrders - req.body.advance,
            description:req.body.description
        };
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        Client.findOne(searchCriteria, function (err, contact) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Client.findOne trace: "+err.message);
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()},(err)=> {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.editOfferPost on method Client.updateOne trace: "+err.message);
                    });
                    activity.editedInvoice(updateInvoice,req.session._id);
                    req.flash("success", i18n.__("Successfully updated the creditnote"));
                    res.redirect("back");
                }
            });
        });
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /view/invoice/:idi viewInvoiceGet
 * @apiParam {String} idi unique id of the invoice where we want to see the invoice from
 * @apiParamExample {String} title:
 "idi": invoice._id
 * @apiDescription shows a table of the information of a specific invoice
 * @apiName viewInvoiceGet
 * @apiGroup View
 * @apiSuccessExample Success-Response:
 res.render("view/view-invoice", {
        "invoice": invoice,
        "client": client,
        "description": i18n.__(description) + " " + (client.firm)?client.firm:client.clientName,
        "settings": settings,
        "currentUrl": "creditView",
        "profile": profile,
        "role": role
    })
 */
exports.viewInvoiceGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, invoice) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.viewInvoiceGet on method Invoice.findOne trace: "+err.message);
        if (!findOneHasError(req, res, err, invoice)) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.viewInvoiceGet on method Client.findOne trace: "+err.message);
                if (!findOneHasError(req, res, err, client)) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.viewInvoiceGet on method Settings.findOne trace: "+err.message);
                        if (!findOneHasError(req, res, err, settings)) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.viewInvoiceGet on method Profile.findOne trace: "+err.message);
                                if (!findOneHasError(req, res, err, profile)) {
                                    let description = (invoice.creditNr) ? "View credit of" : "View invoice of";
                                    res.render("view/view-invoice", {
                                        "invoice": invoice,
                                        "client": client,
                                        "description": i18n.__(description) + " " + (client.firm)?client.firm:client.clientName,
                                        "settings": settings,
                                        "currentUrl": "creditView",
                                        "profile": profile,
                                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                            return user
                                        })).role
                                    })
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
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoicePaidGet on method Invoice.findOne trace: "+err.message);
        let isPaid = !(invoice.isPaid);
        logger.info.log("[INFO]: User "+req.session.email+" is settings invoice paid status to "+isPaid+" for invoice with id: "+req.params.idi);
        if (!findOneHasError(req, res, err, invoice)) {
            let invoiceUpdate;
            if(!invoice.datePaid){
                invoiceUpdate ={
                    isPaid: isPaid,
                    datePaid: Date.now(),
                    lastUpdated: Date.now()
                };
            }else{
                invoiceUpdate ={
                    isPaid: isPaid,
                    lastUpdated: Date.now()
                };
            }
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, invoiceUpdate, async (err) =>  {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoicePaidGet on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    activity.setPaid(invoice,isPaid,req.session._id);
                    let _client = await Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},(err,client) => {return client;
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoicePaidGet on method Client.findOne trace: "+err.message);});
                    let newTotal = (isPaid)?_client.totalPaid+invoice.total:_client.totalPaid-invoice.total;
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{totalPaid:newTotal,lastUpdated:Date.now()},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoicePaidGet on method Client.updateOne trace: "+err.message);
                    });
                    res.redirect("back");
                }
            });
        }
    });
};

exports.offerAgreedGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerAgreedGet on method Invoice.findOne trace: "+err.message);
        logger.info.log("[INFO]: User "+req.session.email+" is setting its offerAgreed to "+!(invoice.isAgreed)+" for invoice with id "+req.params.idi);
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isAgreed: !(invoice.isAgreed),
                lastUpdated: Date.now()
            }, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerAgreedGet on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=>{
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.offerAgreedGet on method Client.updateOne trace: "+err.message);
                    });
                    activity.setAgreed(invoice,!invoice.isAgreed,req.session._id);
                    res.redirect("back");
                }
            });
        }
    });
};

exports.setVat = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        logger.info.log("[INFO]: User "+req.session.email+" is setting its setVat to "+!(invoice.isVatOn)+" for invoice with id "+req.params.idi);
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.setVat on method Invoice.findOne trace: "+err.message);
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isVatOn: !(invoice.isVatOn),
                lastUpdated: Date.now()
            }, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.setVat on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.setVat on method Client.updateOne trace: "+err.message);
                    });
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceUpgradeGet = (req, res) => {
    logger.info.log("[INFO]: User "+req.session.email+" is upgrading its offer with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, async (err, invoice) => {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceUpgradeGet on method Invoice.findOne trace: "+err.message);
        if (!findOneHasError(req, res, err, invoice)) {
            let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=> {return profile;
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceUpgradeGet on method Profile.findOne trace: "+err.message);});
            let nr = getFullNr(profile.invoiceNrCurrent);
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                invoiceNr: nr ,
                offerNr: ""
            }, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceUpgradeGet on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceUpgradeGet on method Client.updateOne trace: "+err.message);});
                    await Profile.updateOne({fromUser:req.session._id},{invoiceNrCurrent:nr+1},(err) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceUpgradeGet on method Profile.updateOne trace: "+err.message);});
                    await activity.upgrade(invoice,req.session._id);
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceDowngradeGet = (req, res) => {
    logger.info.log("[INFO]: User "+req.session.email+" is downgrading its invoice with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceDowngradeGet on method Invoice.findOne trace: "+err.message);
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                offerNr: invoice.invoiceNr,
                invoiceNr: ""
            }, async (err) => {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceDowngradeGet on method Invoice.updateOne trace: "+err.message);
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=> {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/invoiceController.invoiceDowngradeGet on method Client.updateOne trace: "+err.message);});
                    activity.downgrade(invoice,req.session._id);
                    res.redirect("back");
                }
            });
        }
    });
};