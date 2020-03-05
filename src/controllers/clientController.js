/**
 * Here are all the methods for /client
 */

const Profile = require("../models/profile");
const Client = require("../models/client");
const Settings = require("../models/settings");
const invalid = require("../utils/formValidation");
const error = require("../middlewares/error");
const i18n = require("i18n");
const User = require("../models/user");
const activity = require('../utils/activity');
/**
 * @apiVersion 3.0.0
 * @api {get} /client/all getClientAll
 * @apiDescription Shows all clients of the user
 * @apiName getClientAll
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 res.render("clients", {
    "clients": clients,
    "settings": settings,
    "profile": profile,
    "currentUrl": "clientAll",
    "role": role
});
 */
exports.getClientAll = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if (err) console.trace();
        Client.find({fromUser: req.session._id,isRemoved:false}, function (err, clients) {
            if (err) console.trace();
            Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                if (err) console.trace();
                if (!err) {
                    res.render("clients", {
                        "clients": clients,
                        "settings": settings,
                        "profile": profile,
                        "currentUrl": "clientAll",
                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                            return user
                        })).role
                    });
                }
            });
        });
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /client/new getClientNew
 * @apiDescription Shows a form where the user can create a new user
 * @apiName getClientNew
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 res.render("new/new-client", {
    "settings": settings,
    "profile": profile,
    "currentUrl": "clientNew",
    "role": role
});
 */
exports.getClientNew = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (err) console.trace();
        Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
            if (err) console.trace();
            if (!err) {
                res.render("new/new-client", {
                    "settings": settings,
                    "profile": profile,
                    "currentUrl": "clientNew",
                    "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                        return user
                    })).role
                });
            }
        });
    });
};

/**
 * @apiVersion 3.0.0
 * @api {post} /client/new postClientNew
 * @apiDescription creates a new client all parameters given in the form are checked using the formValidator.js
 * @apiName postClientNew
 * @apiGroup Client
 * @apiSuccess Creates a new client for the logged in user
 * @apiSuccessExample Success-Response:
     res.redirect("/client/all");
 * @apiError Does not create a new client it redirects you back to /client/new
 * @apiErrorExample Error-response:
 * res.render("edit/edit-client", {
    "settings": settings,
    "profile": profile,
    "currentUrl": "clientNew",
    "client": {
        "clientName": req.body.clientName,
        "firm": req.body.firm,
        "street": req.body.street,
        "streetNr": req.body.streetNr,
        "vat": req.body.vat,
        "bankNr": req.body.bankNr,
        "postalCode": req.body.postalCode,
        "place": req.body.place,
        "vatPercentage": req.body.vatPercentage
    },
    "role": role
});
 */
exports.postClientNew = async (req, res) => {
    let nameCheck = invalid.valueMustBeAName(req, res, req.body.clientName, true, "client name not correctly filled in");
    let firmCheck = invalid.valueMustBeAName(req, res, req.body.firm, false, "firm name not correctly filled in");
    let streetCheck = (req.body.street) ? invalid.valueMustBeAName(req, res, req.body.street, true) : false;
    let streetNrCheck = (req.body.streetNr) ? invalid.valueMustBeStreetNumber(req, res, req.body.streetNr) : false;
    let emailCheck = false;
    req.body.emails.forEach(email => {
        if (invalid.valueMustBeEmail(req, res, email)) {
            emailCheck = true;
        }
    });
    if (req.body.emails.length === 0 || req.body.emails[0] === "") {
        emailCheck = false;
    }
    let vatCheck = (req.body.vat) ? invalid.valueMustBeVatNumber(req, res, req.body.vat) : false;
    let vatPercentageCheck = invalid.valueMustBeAnInteger(req, res, req.body.vatPercentage, true);
    let bankCheck = (req.body.bankNr) ? invalid.valueMustBeValidIban(req, res, req.body.bankNr) : false;
    let postalCheck = (req.body.postalCode) ? invalid.valueMustBePostalCode(req, res, req.body.postalCode) : false;
    let placeCheck = (req.body.place) ? invalid.valueMustBeAName(req, res, req.body.place, true, "place name not correctly checked in") : false;
    let isNotValid = nameCheck || firmCheck || streetCheck || vatPercentageCheck || streetNrCheck || emailCheck || vatCheck || bankCheck || postalCheck || placeCheck;
    if (isNotValid) {
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            if (err) {
                console.trace();
            }
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                if (err) {
                    console.trace();
                }
                if (!err) {
                    res.render("edit/edit-client", {
                        "settings": settings,
                        "profile": profile,
                        "currentUrl": "clientNew",
                        "client": {
                            "clientName": req.body.clientName,
                            "firm": req.body.firm,
                            "street": req.body.street,
                            "streetNr": req.body.streetNr,
                            "vat": req.body.vat,
                            "bankNr": req.body.bankNr,
                            "postalCode": req.body.postalCode,
                            "place": req.body.place,
                            "vatPercentage": req.body.vatPercentage
                        },
                        "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                            return user
                        })).role
                    });
                }
            });
        });
    } else {
        let newClient = new Client({
            firm: req.body.firm,
            clientName: req.body.clientName,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postalCode: req.body.postalCode,
            place: req.body.place,
            vat: (req.body.vat)?invalid.formatBEVat(req.body.vat):"",
            lang: req.body.lang,
            email: req.body.emails,
            bankNr: (req.body.bankNr)?invalid.formatBEIban(req.body.bankNr):"",
            fromUser: req.session._id,
            vatPercentage: req.body.vatPercentage,
            invoices: []
        });
        newClient.save();
        await activity.addClient(newClient,req.session._id);
        res.redirect("/client/all");
    }
};

/**
 * @apiVersion 3.0.0
 * @api {get} /client/view/:idc getClientView
 * @apiDescription Shows all the information of the clients id from query parameter "idc"
 * @apiName getClientView
 * @apiGroup Client
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *     "client": client,
        "profile": profile,
        "settings": settings
 *  }
 */
exports.getClientView = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc,isRemoved:false}, function (err, client) {
        if (err) console.trace(err);
        if (!err) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if (err) console.trace(err);
                if (!err) {
                    Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                        if (err) console.trace(err);
                        if (!err) {
                            res.render("view/view-client", {
                                "client": client,
                                "profile": profile,
                                "settings": settings,
                                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                    return user
                                })).role
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.getEditClient = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc,isRemoved:false}, function (err, client) {
        if (!error.findOneHasError(req, res, err, client)) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if (!error.findOneHasError(req, res, err, settings)) {
                    Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                        if (!error.findOneHasError(req, res, err, profile)) {
                            res.render("edit/edit-client", {
                                "client": client,
                                "profile": profile,
                                "settings": settings,
                                "currentUrl": "clientEdit",
                                "role": (await User.findOne({_id: req.session._id}, (err, user) => {
                                    return user;
                                })).role
                            })
                        }
                    });
                }
            });
        }
    });
};

exports.postEditClient = (req, res) => {
    Client.findOne({fromUser: req.session._id, _id: req.params.idc}, function (err, client) {
        if (!error.findOneHasError(req, res, err, client)) {
            let nameCheck = invalid.valueMustBeAName(req, res, req.body.clientName, false, "client name not correctly filled in");
            let firmCheck = invalid.valueMustBeAName(req, res, req.body.firm, false, "firm name not correctly filled in");
            let streetCheck = (req.body.street) ? invalid.valueMustBeAName(req, res, req.body.street, true) : false;
            let streetNrCheck = (req.body.streetNr) ? invalid.valueMustBeStreetNumber(req, res, req.body.streetNr) : false;
            let emailCheck = false;
            req.body.emails.forEach((email) => {
                if (invalid.valueMustBeEmail(req, res, email)) {
                    emailCheck = true;
                }
            });
            let vatCheck = (req.body.vat) ? invalid.valueMustBeVatNumber(req, res, req.body.vat,false,client.locale) : false;
            let vatPercentageCheck = invalid.valueMustBeAnInteger(req, res, req.body.vatPercentage, true);
            let bankCheck = (req.body.bankNr) ? invalid.valueMustBeValidIban(req, res, req.body.bankNr) : false;
            let postalCheck = (req.body.postalCode) ? invalid.valueMustBePostalCode(req, res, req.body.postalCode) : false;
            let placeCheck = (req.body.place) ? invalid.valueMustBeAName(req, res, req.body.place, true, "place name not correctly checked in") : false;
            let isNotValid = nameCheck || firmCheck || streetCheck || vatPercentageCheck || streetNrCheck || emailCheck || vatCheck || bankCheck || postalCheck || placeCheck;
            if (!isNotValid) {
                let updatedClient = {
                    clientName: req.body.clientName,
                    firm: req.body.firm,
                    street: req.body.street,
                    streetNr: req.body.streetNr,
                    email: req.body.emails,
                    vat: (req.body.vat)?invalid.formatBEVat():"",
                    vatPercentage: req.body.vatPercentage,
                    bankNr: (req.body.bankNr)?invalid.formatBEIban(req.body.bankNr):"",
                    postalCode: req.body.postalCode,
                    place: req.body.place
                };
                Client.updateOne({fromUser: req.session._id, _id: client._id}, updatedClient, async (err) => {
                    if (!error.updateOneHasError(req, res, err)) {
                        await activity.editedClient(client,req.session._id);
                        req.flash("success", i18n.__("Successfully updated client"));
                        res.redirect("back");
                    }
                });
            } else {
                res.redirect("/edit/client/" + client._id);
            }
        }
    });
};