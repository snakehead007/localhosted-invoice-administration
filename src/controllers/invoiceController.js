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
const Error = require('../middlewares/error');
///TODO when changing an nr: if its profileNrCurrent is lower, change the profileNrCurrent+1

/**
 *
 * @param req
 * @param res
 */
exports.invoiceAllGet = (req, res) => {
    Invoice.find({fromUser: req.session._id,isRemoved:false}, null, {sort: {date: -1}}, function (err, invoices) {
        Error.handler(req,res,err,'5C0000');
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            Error.handler(req,res,err,'5C0001');
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                Error.handler(req,res,err,'5C0002');
                let user = await User.findOne({_id: req.session._id});
                res.render("invoices", {
                    "currentUrl": "invoices",
                    "invoices": invoices,
                    "profile": profile,
                    "settings": settings,
                    "role": user.role,
                    'credits':user.credits
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
        Error.handler(req,res,err,'5C0100');
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            Error.handler(req,res,err,'5C0101');
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                Error.handler(req,res,err,'5C0102');
                let user = await User.findOne({_id: req.session._id});
                res.render("add-file-no-contact", {
                    "profile": profile,
                    "settings": settings,
                    "add": "invoice",
                    "addlink": "invoice",
                    "clients": clients,
                    "role": user.role,
                    'credits': user.credits
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
        Error.handler(req,res,err,'5C0200');
        Profile.findOne({fromUser: req.session._id,isRemoved:false}, function (err, profile) {
            Error.handler(req,res,err,'5C0201');
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                Error.handler(req,res,err,'5C0202');
                let user = await User.findOne({_id: req.session._id});
                res.render("add-file-no-contact", {
                    "profile": profile,
                    "settings": settings,
                    "add": "offer",
                    "addlink": "offer",
                    "clients": clients,
                    "role": user.role,
                    'credits':user.credits
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
        Error.handler(req,res,err,'5C0300');
        Profile.findOne({fromUser: req.session._id}, function (err, profile) {
            Error.handler(req,res,err,'5C0301');
            Client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                Error.handler(req,res,err,'5C0302');
                let user = await User.findOne({_id: req.session._id});
                let givenObjects = {
                    "profile": profile,
                    "settings": settings,
                    "add": "creditnote",
                    "addlink": "credit",
                    "clients": clients,
                    "role": user.role,
                    'credits': user.credits
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
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new invoice using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'5C0400');
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            Error.handler(req,res,err,'5C0401');
            if (client === null) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an invoice with a client"));
                res.redirect("/invoice/new/invoice");
            } else {
                client.save( async (err) => {
                    Error.handler(req,res,err,'5C0402');
                    //find latest invoiceNr and update profile with it.
                    let invoices = await Invoice.find({fromUser:req.session._id},null,{sort:{invoiceNr:-1}},(err,invoices)=>{
                        Error.handler(req,res,err,'5C0409');
                        return invoices;
                    });
                try{
                    let lastInvoiceNrFull = invoices[0].invoiceNr;
                    console.log("invoice: "+lastInvoiceNrFull);
                    if(!lastInvoiceNrFull){
                        throw new Error();
                    }
                    if(lastInvoiceNrFull) {
                        let lastInvoiceNr = Number(String(lastInvoiceNrFull).substr(4, lastInvoiceNrFull.length)) + 1;
                        await Profile.updateOne({fromUser: req.session._id}, {invoiceNrCurrent: lastInvoiceNr}, (err) => {
                            Error.handler(req, res, err, '5C0410');
                        });
                    }
                }catch(err){
                    console.trace(err);
                    logger.info.log("[INFO]: Email:'"+req.session.email+"' first invoice created");
                    await Profile.updateOne({fromUser: req.session._id}, {invoiceNrCurrent: 1}, (err) => {
                        Error.handler(req, res, err, '5C0410');
                    });
                }
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        Error.handler(req,res,err,'5C0403');
                            Profile.updateOne({
                                fromUser: req.session._id
                            }, {
                                invoiceNrCurrent: profile.invoiceNrCurrent + 1
                            }, async function (err) {
                                Error.handler(req,res,err,'5C04004');
                                if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.invoiceNrCurrent+1);
                                let _invoiceNr = getFullNr(profile.invoiceNrCurrent);
                                let newInvoice = new Invoice({
                                    fromClient: client._id,
                                    date: Date.now(),
                                    invoiceNr: _invoiceNr,
                                    clientName: client.clientName,
                                    firmName: client.firm,
                                    total: 0,
                                    fromUser: req.session._id,
                                    description:"",
                                    isRemoved:false
                                });
                                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new invoice with : "+JSON.stringify(newInvoice));
                                await Client.findOne({
                                    fromUser: req.session._id,
                                    _id: client._id,isRemoved:false
                                }, async function (err) {
                                    Error.handler(req,res,err,'5C0405');
                                    if (!err) {
                                        client.invoices.push(newInvoice._id);
                                        await client.save((err)=>{
                                            Error.handler(req,res,err,'5C0406');
                                        });
                                    }
                                });
                                await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                    Error.handler(req,res,err,'5C0407');
                                });
                                await newInvoice.save(function (err) {
                                    Error.handler(req,res,err,'5C0408');
                                    if (!err) {
                                        activity.addInvoice(newInvoice,req.session._id);
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
exports.creditNewGet = (req, res) => {
    const idc = (req.body.idc) ? req.body.idc : req.params.idc;
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new creditnote using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'5C0500');
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            Error.handler(req,res,err,'5C0501');
            if (client === null) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an creditnote with a client"));
                res.redirect("/invoice/new/credit");
            } else {
                client.save( async (err) => {
                    Error.handler(req,res,err,'5C0502');
                    //find latest invoiceNr and update profile with it.
                    let invoices = await Invoice.find({fromUser:req.session._id},null,{sort:{creditNr:-1}},(err,invoices)=>{
                        Error.handler(req,res,err,'5C0509');
                        return invoices;
                    });
                try{
                    let lastCreditNrFull = invoices[0].creditNr;

                    console.log("credit: "+lastCreditNrFull);
                    if(!lastCreditNrFull){
                        throw "throwing error";
                    }
                    if(lastCreditNrFull) {
                        let lastCreditNr = Number(String(lastCreditNrFull).substr(4, lastCreditNrFull.length)) + 1;
                        await Profile.updateOne({fromUser: req.session._id}, {creditNrCurrent: lastCreditNr}, (err) => {
                            Error.handler(req, res, err, '5C0510');
                        });
                    }
                }catch(err){
                    console.trace(err);
                    logger.info.log("[INFO]: Email:'"+req.session.email+"' first credit created");
                    await Profile.updateOne({fromUser: req.session._id}, {creditNrCurrent: 1}, (err) => {
                        Error.handler(req, res, err, '5C0510');
                    });
                }
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        Error.handler(req,res,err,'5C0503');
                            Profile.updateOne(
                                {fromUser: req.session._id},
                                {creditNrCurrent: profile.creditNrCurrent + 1}, async function (err) {
                                    Error.handler(req,res,err,'5C0504');
                                    if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.creditNrCurrent+1);
                                    if (!err) {
                                        let creditNr = getFullNr(profile.creditNrCurrent);
                                        let newInvoice = new Invoice({
                                            fromClient: idc,
                                            date: Date.now(),
                                            creditNr: creditNr,
                                            clientName: client.clientName,
                                            firmName: client.firm,
                                            total: 0,
                                            fromUser: req.session._id
                                            ,isRemoved:false
                                        });
                                        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new invoice with : "+JSON.stringify(newInvoice));
                                        await Client.findOne({
                                            fromUser: req.session._id,
                                            _id: client._id,isRemoved:false
                                        }, function (err) {
                                            Error.handler(req,res,err,'5C0505');
                                            client.invoices.push(newInvoice._id);
                                        });
                                        await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                            Error.handler(req,res,err,'5C0506');
                                        });
                                        await newInvoice.save((err)=>{
                                            Error.handler(req,res,err,'5C0507');
                                        });
                                        activity.addCredit(newInvoice,req.session._id);
                                        res.redirect("/order/all/"+newInvoice._id);
                                    }
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
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new offer using "+((req.params.idc)?"GET":"POST")+" request");
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        Error.handler(req,res,err,'5C0600');
        Client.findOne({fromUser: req.session._id, _id: idc,isRemoved:false}, function (err, client) {
            Error.handler(req,res,err,'5C0601');
            if (client === null) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried making new invoice, but had no client. redirected, with message");
                req.flash("danger", i18n.__("Cannot make an offer with a client"));
                res.redirect("/invoice/new/offer");
            } else {
                client.save( async (err) => {
                    Error.handler(req,res,err,'5C0602');
                    //find latest invoiceNr and update profile with it.
                    let invoices = await Invoice.find({fromUser:req.session._id},null,{sort:{offerNr:-1}},(err,invoices)=>{
                        Error.handler(req,res,err,'5C0609');
                        return invoices;
                    });
                    try {
                        let lastOfferNrFull = invoices[0].offerNr;
                        console.log(lastOfferNrFull);
                        if(!lastOfferNrFull){
                            throw "throwing error";
                        }
                        if (lastOfferNrFull) {
                            let lastOfferNr = Number(String(lastOfferNrFull).substr(4, lastOfferNrFull.length)) + 1;
                            await Profile.updateOne({fromUser: req.session._id}, {offerNrCurrent: lastOfferNr}, (err) => {
                                Error.handler(req, res, err, '5C0610');
                            });
                        }
                    }catch(err){
                        console.trace(err);
                        logger.info.log("[INFO]: Email:'"+req.session.email+"' first offer created");
                        await Profile.updateOne({fromUser: req.session._id}, {offerNrCurrent: 1}, (err) => {
                            Error.handler(req, res, err, '5C0610');
                        });
                    }
                    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
                        Error.handler(req,res,err,'5C0603');
                        if (!err) {
                                if (!err) {
                                    Profile.updateOne({
                                        fromUser: req.session._id
                                    }, {
                                        offerNrCurrent: profile.offerNrCurrent + 1
                                    }, async function (err) {
                                        Error.handler(req,res,err,'5C0604');
                                        if(!err) logger.info.log("[INFO]: profile from User "+req.session.email+" has updated its invoiceNrCurrent to "+profile.offerNrCurrent+1);
                                        if (!err) {
                                            let offerNr = getFullNr(profile.offerNrCurrent);
                                            let newInvoice = new Invoice({
                                                fromClient: idc,
                                                date: Date.now(),
                                                offerNr: offerNr,
                                                clientName: client.clientName,
                                                firmName: client.firm,
                                                fromUser: req.session._id,
                                                description:"",isRemoved:false
                                            });
                                            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new invoice with : "+JSON.stringify(newInvoice));
                                            await Client.findOne({
                                                fromUser: req.session._id,
                                                _id: client._id,isRemoved:false
                                            }, function (err) {
                                                Error.handler(req,res,err,'5C0605');
                                                client.invoices.push(newInvoice._id);
                                            });
                                            await newInvoice.save((err)=>{
                                                Error.handler(req,res,err,'5C0606');
                                            });
                                            await Client.updateOne({fromUser:req.session._id,_id:idc},{lastUpdated:Date.now()},(err)=>{
                                                Error.handler(req,res,err,'5C0607');
                                            });
                                            if (!err) {
                                                activity.addOffer(newInvoice,req.session._id);
                                                res.redirect("/order/all/"+newInvoice._id);
                                            }
                                        }
                                    });
                                }
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
        Error.handler(req,res,err,'5C0700');
        Invoice.find({
            fromUser: req.session._id,
            fromClient: req.params.idc,isRemoved:false
        }).sort("-invoiceNr").exec(function (err, invoices) {
            Error.handler(req,res,err,'5C0701');
            Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                Error.handler(req,res,err,'5C0702');
                Profile.findOne({fromUser:req.session._id}, async (err, profile) => {
                    Error.handler(req,res,err,'5C0703');
                    if (!err) {
                        let user = await User.findOne({_id: req.session._id});
                        let givenObject = {
                            "client": client,
                            "invoices": invoices,
                            "settings": settings,
                            "profile": profile,
                            "currentUrl": "invoiceClient",
                            "role": user.role,
                            'credits':user.credits
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
        Error.handler(req,res,err,'5C0800');
        Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
            Error.handler(req,res,err,'5C0801');
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                Error.handler(req,res,err,'5C0802');
                Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                    Error.handler(req,res,err,'5C0803');
                    let user = await User.findOne({_id: req.session._id});
                    let givenObject = {
                        "invoice": invoice,
                        "client": client,
                        "settings": settings,
                        "profile": profile,
                        "currentUrl": "invoiceEdit",
                        "role": user.role,
                        'credits':user.credits
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
exports.editInvoicePost = async (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to edit invoice with: "+JSON.stringify(req.body));
    let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=>{return profile;});
    let invoiceNrWithoutYear;
    /*if(req.body.invoiceNr){
        invoiceNrWithoutYear = Number(req.body.invoiceNr.substr(4,req.body.invoiceNr.length));
        if(invoiceNrWithoutYear>998){
            req.flash('danger',i18n.__("Invoice number is too high"));
            res.redirect('back');
            return;
        }
    }*/
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved:false}, async (err, orders) => {
        Error.handler(req,res,err,'5C0900');
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            Error.handler(req,res,err,'5C0901');
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, (err, invoice) => {
            Error.handler(req,res,err,'5C0902');
            return invoice
        });

        if(currentInvoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        if(!req.body.invoiceNr||!req.body.date){
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing invoice but no date or invoiceNr were given");
            req.flash('danger',i18n.__("Please fill in all the required fields"));
            res.redirect('back');
            return;
        }
        if(currentInvoice.isPaid){
            if(!req.body.datePaid||req.body.datePaid!== parseDate(currentInvoice.datePaid)) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing the invoice's datePaid but isPaid is turned on");
                req.flash('danger', i18n.__("Change this invoice to unpaid first, to remove its pay date."));
                res.redirect('back');
                return;
            }
        }
        if(await invoiceUtil.isInvoiceNrAlreadyInUse(req.body.invoiceNr,req.session._id)){
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing the invoiceNr "+req.body.invoiceNr+", but it is already taken.");
            req.flash('danger',i18n.__("This invoice number is already in use."));
            res.redirect('back');
            return;
        }
        if(req.body.nickname.trim().length>=46){
            req.flash('warning',i18n.__('Maximum characters for nickname exceeded. use 45 or less characters'));
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
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else if (!req.body.date) {
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else if (req.body.date && req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else {
            updateInvoice = {
                invoiceNr: req.body.invoiceNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        }
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is updating the invoice with: "+JSON.stringify(updateInvoice));
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        if(req.body.invoiceNr){
            if(invoiceNrWithoutYear>profile.invoiceNrCurrent){
                Profile.updateOne({_id:profile._id},{invoiceNrCurrent:invoiceNrWithoutYear+1},(err)=>{
                    Error.handler(req,res,err,'5C0903');
                });
            }
        }
        Client.findOne(searchCriteria, function (err, client) {
            Error.handler(req,res,err,'5C0904');
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                Error.handler(req,res,err,'5C0905');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()},(err)=>{
                        Error.handler(req,res,err,'5C0906');
                    });
                    activity.editedInvoice(updateInvoice,req.session._id);
                    req.flash("success", i18n.__("Successfully updated the invoice"));
                    res.redirect("back");
                }
            });
        });
    });
};

exports.editOfferPost = async (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to edit offer with: "+JSON.stringify(req.body));
    let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=>{return profile;});
    let invoiceNrWithoutYear;
    /*if(req.body.offerNr){
        invoiceNrWithoutYear = Number(req.body.offerNr.substr(4,req.body.offerNr.length));
        if(invoiceNrWithoutYear>998){
            req.flash('danger',i18n.__("Invoice number is too high"));
            res.redirect('back');
            return;
        }
    }*/
    Order.find({fromUser: req.session._id, fromInvoice: req.params.idi,isRemoved:false}, async (err, orders) => {
        Error.handler(req,res,err,'5C1000');
        let totOrders = 0;
        for (let i = 0; i <= orders.length - 1; i++) {
            totOrders += (orders[i].price * orders[i].amount);
        }
        let settings = await Settings.findOne({fromUser: req.session._id}, (err, settings) => {
            Error.handler(req,res,err,'5C1001');
            return settings
        });
        let currentInvoice = await Invoice.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, (err, invoice) => {
            Error.handler(req,res,err,'5C1002');
            return invoice
        });
        if(currentInvoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this offer when it is already send'));
            res.redirect('back');
            return;
        }
        if(!req.body.offerNr||!req.body.date){
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing offer but no date or invoiceNr were given");
            req.flash('danger',i18n.__("Please fill in all the required fields"));
            res.redirect('back');
            return;
        }
        if(currentInvoice.isPaid){
            if(!req.body.datePaid||req.body.datePaid!== parseDate(currentInvoice.datePaid)) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing the offer's datePaid but isPaid is turned on");
                req.flash('danger', i18n.__("Change this invoice to unpaid first, to remove its pay date."));
                res.redirect('back');
                return;
            }
        }
        if(await invoiceUtil.isOfferNrAlreadyInUse(req.body.offerNr,req.session._id)){
            logger.info.log("[INFO]: Email:\'"+req.session.email+"\' tried editing the offerNr "+req.body.offerNr+", but it is already taken.");
            req.flash('danger',i18n.__("This invoice number is already in use."));
            res.redirect('back');
            return;
        }
        if(req.body.nickname.trim().length>=46){
            req.flash('warning',i18n.__('Maximum characters for nickname exceeded. use 45 or less characters'));
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
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else if (!req.body.date) {
            updateInvoice = {
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else if (req.body.date && req.body.datePaid) {
            updateInvoice = {
                date: parseDateDDMMYYYY(req.body.date),
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                datePaid: datePaid,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        } else {
            updateInvoice = {
                offerNr: req.body.offerNr,
                advance: req.body.advance,
                offerNr: req.body.offerNr,
                lastUpdated: Date.now(),
                total: totOrders - req.body.advance,
                description:req.body.description,
                nickname:req.body.nickname
            };
        }
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is updating the offer with: "+JSON.stringify(updateInvoice));
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        if(req.body.offerNr){
            if(invoiceNrWithoutYear>profile.offerNrCurrent){
                Profile.updateOne({_id:profile._id},{offerNrCurrent:invoiceNrWithoutYear+1},(err)=>{
                    Error.handler(req,res,err,'5C1003');
                });
            }
        }
        Client.findOne(searchCriteria, function (err, contact) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                if (!updateOneHasError(req, res, err)) {
                    Error.handler(req,res,err,'5C1004');
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()});
                    activity.editedInvoice(updateInvoice,req.session._id);
                    req.flash("success", i18n.__("Successfully updated the offer"));
                    res.redirect("back");
                }
            });
        });
    });
};

exports.editCreditPost = async (req, res) => {
    let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=>{return profile;});
    let invoiceNrWithoutYear;
    /*if(req.body.creditNr){
        invoiceNrWithoutYear = Number(req.body.creditNr.substr(4,req.body.creditNr.length));
        if(invoiceNrWithoutYear>998){
            req.flash('danger',i18n.__("Invoice number is too high"));
            res.redirect('back');
            return;
        }
    }*/
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
        if(currentInvoice.isSend){
            req.flash('warning',i18n.__('You cannot edit this credit when it is already send'));
            res.redirect('back');
            return;
        }
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
        if(req.body.nickname.trim().length>=46){
            req.flash('warning',i18n.__('Maximum characters for nickname exceeded. use 45 or less characters'));
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
            nickname:req.body.nickName,
            description:req.body.description
        };
        let searchCriteria = {fromUser: req.session._id,isRemoved:false};
        if (orders.length > 0) {
            searchCriteria = {fromUser: req.session._id, _id: orders[0].fromClient,isRemoved:false};
        }
        if(req.body.creditNr){
            if(invoiceNrWithoutYear>profile.creditNrCurrent){
                Profile.updateOne({_id:profile._id},{creditNrCurrent:invoiceNrWithoutYear+1},(err)=>{
                    if(err) {
                        Error.handler(req,res,err,'5C1100');
                        req.flash('danger',i18n.__('We experienced an error on our part, please '))
                    }
                });
            }
        }
        Client.findOne(searchCriteria, function (err, contact) {
            Error.handler(req,res,err,'5C1101');
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, updateInvoice, async (err) => {
                Error.handler(req,res,err,'5C1102');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:currentInvoice.fromClient},{lastUpdated:Date.now()},(err)=> {
                        Error.handler(req,res,err,'5C1103');
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
        Error.handler(req,res,err,'5C1200');

        if (!findOneHasError(req, res, err, invoice)) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient,isRemoved:false}, function (err, client) {
                Error.handler(req,res,err,'5C1201');
                if (!findOneHasError(req, res, err, client)) {
                    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                        Error.handler(req,res,err,'5C1202');
                        if (!findOneHasError(req, res, err, settings)) {
                            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                                Error.handler(req,res,err,'5C1203');
                                if (!findOneHasError(req, res, err, profile)) {
                                    let description = (invoice.creditNr) ? "View credit of" : "View invoice of";
                                    let user = await User.findOne({_id: req.session._id});
                                    res.render("view/view-invoice", {
                                        "invoice": invoice,
                                        "client": client,
                                        "description": i18n.__(description) + " " + (client.firm)?client.firm:client.clientName,
                                        "settings": settings,
                                        "currentUrl": "creditView",
                                        "profile": profile,
                                        "role": user.role,
                                        'çredits':user.credits
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
        Error.handler(req,res,err,'5C1300');
        if(!invoice.isSend){
            req.flash('warning',i18n.__('You cannot set invoice to paid, when it is not send'));
            res.redirect('back');
            return;
        }
        let isPaid = true; //can only set to true, not false
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is settings invoice paid status to "+isPaid+" for invoice with id: "+req.params.idi);
        if (!findOneHasError(req, res, err, invoice)) {
            let invoiceUpdate;
            if(!invoice.datePaid){
                invoiceUpdate ={
                    isPaid: true,
                    datePaid: Date.now(),
                    lastUpdated: Date.now()
                };
            }else{
                invoiceUpdate ={
                    isPaid: true,
                    lastUpdated: Date.now()
                };
            }
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, invoiceUpdate, async (err) =>  {
                Error.handler(req,res,err,'5C1301');
                if (!updateOneHasError(req, res, err)) {
                    Error.handler(req,res,err,'5C1302');
                    activity.setPaid(invoice,isPaid,req.session._id);
                    let _client = await Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},(err,client) => {
                        Error.handler(req, res, err, '5C1303');
                        return client;
                    });
                    let newTotal = (isPaid)?_client.totalPaid+invoice.total:_client.totalPaid-invoice.total;
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{totalPaid:newTotal,lastUpdated:Date.now()},(err)=>{
                        Error.handler(req,res,err,'5C1304');
                    });
                    res.redirect("back");
                }
            });
        }
    });
};

exports.offerAgreedGet = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        Error.handler(req,res,err,'5C1400');
        if(!invoice.isSend){
            req.flash('warning',i18n.__('You cannot set offer to agreed, when it is not send'));
            res.redirect('back');
            return;
        }
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is setting its offerAgreed to "+!(invoice.isAgreed)+" for invoice with id "+req.params.idi);
        //can only set agreed to true
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isAgreed: true,
                lastUpdated: Date.now()
            }, async (err) => {
                Error.handler(req,res,err,'5C1401');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=>{
                        Error.handler(req,res,err,'5C1402');
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
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is setting its setVat to "+!(invoice.isVatOn)+" for invoice with id "+req.params.idi);
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot change the VAT of this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        Error.handler(req,res,err,'5C1500');
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                isVatOn: !(invoice.isVatOn),
                lastUpdated: Date.now()
            }, async (err) => {
                Error.handler(req,res,err,'5C1501');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err) => {
                        Error.handler(req,res,err,'5C1502');
                    });
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceUpgradeGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is upgrading its offer with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, async (err, invoice) => {
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot upgrade this offer when it is already send'));
            res.redirect('back');
            return;
        }
        Error.handler(req,res,err,'5C1600');
        if (!findOneHasError(req, res, err, invoice)) {
            let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=> {
                Error.handler(req,res,err,'5C1602');
                return profile;});
            let nr = getFullNr(profile.invoiceNrCurrent);
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                invoiceNr: nr ,
                offerNr: ""
            }, async (err) => {
                Error.handler(req,res,err,'5C1603');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err) => {
                        Error.handler(req,res,err,'5C1604');});
                    await Profile.updateOne({fromUser:req.session._id},{invoiceNrCurrent:nr+1},(err) => {
                        Error.handler(req,res,err,'5C1605');});
                    await activity.upgrade(invoice,req.session._id);
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceDowngradeGet = (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is downgrading its invoice with id "+req.params.idi);
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        if(invoice.isSend){
            req.flash('warning',i18n.__('You cannot downgrade this invoice when it is already send'));
            res.redirect('back');
            return;
        }
        Error.handler(req,res,err,'5C1700');
        if (!findOneHasError(req, res, err, invoice)) {
            Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
                offerNr: invoice.invoiceNr,
                invoiceNr: ""
            }, async (err) => {
                Error.handler(req,res,err,'5C1701');
                if (!updateOneHasError(req, res, err)) {
                    await Client.updateOne({fromUser:req.session._id,_id:invoice.fromClient},{lastUpdated:Date.now()},(err)=> {
                        Error.handler(req,res,err,'5C1702');});
                    activity.downgrade(invoice,req.session._id);
                    res.redirect("back");
                }
            });
        }
    });
};

exports.invoiceCloneGet = async (req,res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is trying to clone invoice with id "+req.params.idi);
    let invoices = await Invoice.find({fromUser:req.session._id},null,{sort:{invoiceNr:-1}},(err,invoices)=>{
        Error.handler(req,res,err,'5C0409');
        return invoices;
    });
    try{
        let lastInvoiceNrFull = invoices[0].invoiceNr;
        console.log("invoice: "+lastInvoiceNrFull);
        if(!lastInvoiceNrFull){
            throw new Error();
        }
        if(lastInvoiceNrFull) {
            let lastInvoiceNr = Number(String(lastInvoiceNrFull).substr(4, lastInvoiceNrFull.length)) + 1;
            await Profile.updateOne({fromUser: req.session._id}, {invoiceNrCurrent: lastInvoiceNr}, (err) => {
                Error.handler(req, res, err, '5C0410');
            });
        }
    }catch(err){
        console.trace(err);
        logger.info.log("[INFO]: Email:'"+req.session.email+"' first invoice created");
        await Profile.updateOne({fromUser: req.session._id}, {invoiceNrCurrent: 1}, (err) => {
            Error.handler(req, res, err, '5C0410');
        });
    }
    let invoice = await Invoice.findOne({_id:req.params.idi,fromUser:req.session._id,isRemoved:false},(err,invoice)=>{
        Error.handler(req,res,err,'5C1800');
        return invoice;
    });
    let orders = await Order.find({fromInvoice:req.params.idi,fromUser:req.session._id},(err,orders)=>{
        Error.handler(req,res,err,'5C1801');
        return orders;
    });
    let profile = await Profile.findOne({fromUser:req.session._id},(err,profile)=>{
        Error.handler(req,res,err,'5C1802');
        return profile;
    });

    let client = await Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},(err,client)=>{
        Error.handler(req,res,err,'5C1802');
        return client;
    });
    //create invoice
    let newInvoice = new Invoice({
        fromClient: invoice.fromClient,
        total: invoice.total,
        fromUser: req.session._id,
        description: invoice.description,
        isVatOn: invoice.isVatOn,
        firmName:invoice.firmName,
        clientName:invoice.clientName,
    });

    //update invoice, nr. update profile, nr
    let type = invoiceUtil.getOnlyTypeOfInvoice(invoice);
    switch(type){
        case 'invoice':
            Profile.updateOne({fromUser:req.session._id},{invoiceNrCurrent:profile.invoiceNrCurrent+1},(err)=>{
                Error.handler(req,res,err,'5C1803');
            });
            Object.assign(newInvoice,{
                invoiceNr: getFullNr(profile.invoiceNrCurrent)
            });
            break;
        case 'offer':
            Profile.updateOne({fromUser:req.session._id},{offerNrCurrent:profile.offerNrCurrent+1},(err)=>{
                Error.handler(req,res,err,'5C1804');
            });
            Object.assign(newInvoice,{
                offerNr: getFullNr(profile.offerNrCurrent)
            });
            break;
        case 'credit':
            Profile.updateOne({fromUser:req.session._id},{offerNrCurrent:profile.offerNrCurrent+1},(err)=>{
                Error.handler(req,res,err,'5C1805');
            });
            Object.assign(newInvoice,{
                creditNr: getFullNr(profile.creditNrCurrent)
            });
            break;
        default:
            Error.handler(req,res,err,'5C1806');
            break;
    }
    //create orders
    let newOrders = [];
    for(let o of orders){
        let newOrder = new Order({
            description: o.description,
            amount: o.amount,
            price: o.price,
            total: o.total,
            fromUser: o.fromUser,
            fromInvoice: newInvoice._id,
            fromClient: o.fromClient,
            isRemoved: o.isRemoved
            });
        await newOrder.save((err)=>{
            Error.handler(req,res,err,'5C1807');
        });
        newOrders.push(newOrder._id);
    }

    //update invoice, orders
    Object.assign(newInvoice,{orders:newOrders});
    await newInvoice.save((err)=>{
        Error.handler(req,res,err,'5C1808');
    });

    //update client, invoices
    let invoicesOfClient = client.invoices;
    invoicesOfClient.push(newInvoice._id);
    console.log(invoicesOfClient);
    ///TODO does not add correctly
    await Client.updateOne({_id:client._id},{invoices:invoicesOfClient},(err)=>{
        Error.handler(req,res,err,'5C1809');
    });
    req.flash('success', i18n.__('Invoice successfully cloned'));
    if(req.params.redirect) {
        res.redirect('/order/all/'+newInvoice._id);
    }else{
        res.redirect('back');
    }
};



exports.turnOnIsSend = (req, res) => {
    Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' is setting its isSend true for invoice with id "+req.params.idi);
        Error.handler(req,res,err,'5C1900');
        Invoice.updateOne({fromUser: req.session._id, _id: req.params.idi}, {
            isSend: true,
            lastUpdated: Date.now(),
            sendDate: Date.now()
        }, async (err) => {
            Error.handler(req,res,err,'5C1901');
            res.redirect("back");
        });
    })
};
