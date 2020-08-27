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
const logger = require('../middlewares/logger');
const M = require('../utils/mongooseSchemas');
/**
 * @apiVersion 3.0.0
 * @api {get} /client/all getClientAll
 * @apiDescription Shows all clients of the user
 * @apiName getClientAll
 * @apiGroup ClientRouter
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
exports.getClientAll = async (req, res) => {
    //renders /view/clients, currently url clients
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
    res.render("clients", {
        "clients": await new M.client().find(req,res,{fromUser: req.session._id,isRemoved:false},null,{sort:{lastUpdated:-1}}),
        "settings": await new M.settings().findOne(req,res,{fromUser: req.session._id}),
        "profile": await new M.profile().findOne(req,res,{fromUser:req.session._id}),
        "currentUrl": "clientAll",
        "role": user.role,
        'credits':user.credits
    });
};

/**
 * @apiVersion 3.0.0
 * @api {get} /client/new getClientNew
 * @apiDescription Shows a form where the user can create a new user
 * @apiName getClientNew
 * @apiGroup ClientRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 res.render("new/new-client", {
    "settings": settings,
    "profile": profile,
    "currentUrl": "clientNew",
    "role": role
});
 */
exports.getClientNew = async (req, res) => {
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
    res.render("new/new-client", {
        "settings": await new M.settings().findOne(req,res,{fromUser:req.session._id}),
        "profile": await new M.profile().findOne(req,res,{fromUser:req.session._id}),
        "currentUrl": "clientNew",
        "role": user.role,
        'credits':user.credits
    });
};

/**
 * @apiVersion 3.0.0
 * @api {post} /client/new postClientNew
 * @apiDescription creates a new client all parameters given in the form are checked using the formValidator.js
 * @apiName postClientNew
 * @apiGroup ClientRouter
 * @apiSuccess Creates a new client for the logged in user
 * @apiSuccessExample Success-Response:
     res.redirect("/client/all");
 * @apiError ClientError Does not create a new client it redirects you back to /client/new
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
    let emails = [];
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to create new client with :"+JSON.stringify(req.body));
    let nameCheck = invalid.valueMustBeAName(req, res, req.body.clientName, true, "client name not correctly filled in");
    let firmCheck = invalid.valueMustBeAName(req, res, req.body.firm,   false, "firm name not correctly filled in");
    let streetCheck = (req.body.street) ? invalid.valueMustBeAName(req, res, req.body.street, true) : false;
    let streetNrCheck = (req.body.streetNr) ? invalid.valueMustBeStreetNumber(req, res, req.body.streetNr) : false;
    let emailCheck = false;
    try{
        if(req.body.emails0){
            emails.push(req.body.emails0);
        }if(req.body.emails1){
            emails.push(req.body.emails1);
        }if(req.body.emails2){
            emails.push(req.body.emails2);
        }if(req.body.emails3){
            emails.push(req.body.emails3);
        }if(req.body.emails4){
            emails.push(req.body.emails4);
        }
        if(emails){
            console.log(emails);
            emails.forEach((email) => {
                if (invalid.valueMustBeEmail(req, res, email)) {
                    emailCheck = true;
                }
            });
        }}catch(err){
        error.handler(req,res,err,'1C05A0');
        return;
    }
    let vatCheck = (req.body.vat) ? invalid.valueMustBeVatNumber(req, res, req.body.vat) : false;
    let vatPercentageCheck = invalid.valueMustBeAnInteger(req, res, req.body.vatPercentage, true);
    let bankCheck = (req.body.bankNr) ? invalid.valueMustBeValidIban(req, res, req.body.bankNr) : false;
    let placeCheck = (req.body.place) ? invalid.valueMustBeAName(req, res, req.body.place, true, "place name not correctly checked in") : false;
    let isNotValid = nameCheck || firmCheck || streetCheck || vatPercentageCheck || streetNrCheck || emailCheck || vatCheck || bankCheck || placeCheck;
    if (isNotValid) {
        logger.info.log("[INFO]: Email:\'"+req.session.email+"\' body not valid for creating a client, redirecting back");
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            if (err) {
                error.handler(req,res,err,'1C0200');
            }
            Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                if (err) {
                    error.handler(req,res,err,'1C0201');
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
                        "role": user.role,
                        'çredits':user.credits
                    });
                }
            });
        });
    } else {
        logger.info.log("[INFO]: User"+req.session.email+" body valid for creating a client");
        let newClient = new Client({
            firm: req.body.firm,
            clientName: req.body.clientName,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postalCode: req.body.postalCode,
            place: req.body.place,
            vat: (req.body.vat)?invalid.formatBEVat(req.body.vat):"",
            lang: req.body.lang,
            email: emails,
            bankNr: (req.body.bankNr)?invalid.formatBEIban(req.body.bankNr):"",
            fromUser: req.session._id,
            vatPercentage: req.body.vatPercentage,
            invoices: []
        });
        newClient.save((err)=>{
            if(err) logger.error.log("[ERROR]: Email:\'"+req.session.email+"\' ")
        });
        await activity.addClient(newClient,req.session._id);
        res.redirect("/client/all");
    }
};

/**
 * @apiVersion 3.0.0
 * @api {get} /client/view/:idc getClientView
 * @apiDescription Shows all the information of the clients id from query parameter "idc"
 * @apiName getClientView
 * @apiGroup ViewRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *     "client": client,
        "profile": profile,
        "settings": settings
 *  }
 */
exports.getClientView = async (req, res) => {
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
        res.render("view/view-client", {
                "client": await M.client().findOne(req, res, {
                    fromUser: req.session._id,
                    _id: req.params.idc,
                    isRemoved: false
                }),
                "settings": await M.settings().findOne(req, res, {fromUser: req.session._id}),
                "profile": await M.profile().findOne(req, res, {fromUser: req.session._id}),
                "role": user.role,
                'credits':user.credits
            }
        )
};

exports.getEditClient = async (req, res) => {
    let user = await new M.user().findOne(req,res,{_id: req.session._id});
    Client.findOne({fromUser: req.session._id, _id: req.params.idc,isRemoved:false}, function (err, client) {
        error.handler(req,res,err,'1C0400');
        if (!error.findOneHasError(req, res, err, client)) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                error.handler(req,res,err,'1C0401');
                if (!error.findOneHasError(req, res, err, settings)) {
                    Profile.findOne({fromUser: req.session._id}, async (err, profile) => {
                        error.handler(req,res,err,'1C0402');
                        if (!error.findOneHasError(req, res, err, profile)) {
                            res.render("edit/edit-client", {
                                "client": client,
                                "profile": profile,
                                "settings": settings,
                                "currentUrl": "clientEdit",
                                "role": user.role,
                                'credits':user.credits
                            })
                        }
                    });
                }
            });
        }
    });
};

exports.postEditClient = async (req, res) => {
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' trying to edit a client with : "+JSON.stringify(req.body));
    let emails = [];
    Client.findOne({fromUser: req.session._id, _id: req.params.idc}, function (err, client) {
        error.handler(req,res,err,'1C0500');
        if (!error.findOneHasError(req, res, err, client)) {
            let nameCheck = invalid.valueMustBeAName(req, res, req.body.clientName, false, "client name not correctly filled in");
            let firmCheck = invalid.valueMustBeAName(req, res, req.body.firm, false, "firm name not correctly filled in");
            let streetCheck = (req.body.street) ? invalid.valueMustBeAName(req, res, req.body.street, true) : false;
            let streetNrCheck = (req.body.streetNr) ? invalid.valueMustBeStreetNumber(req, res, req.body.streetNr) : false;
            let emailCheck = false;
            console.log(req.body);
            try{
                if(req.body.emails0){
                    emails.push(req.body.emails0);
                }if(req.body.emails1){
                    emails.push(req.body.emails1);
                }if(req.body.emails2){
                    emails.push(req.body.emails2);
                }if(req.body.emails3){
                    emails.push(req.body.emails3);
                }if(req.body.emails4){
                    emails.push(req.body.emails4);
                }
            if(emails){
                console.log(emails);
                emails.forEach((email) => {
                    if (invalid.valueMustBeEmail(req, res, email)) {
                        emailCheck = true;
                    }
                });
            }}catch(err){
                error.handler(req,res,err,'1C0500');
                return;
            }

            let vatCheck = (req.body.vat) ? invalid.valueMustBeVatNumber(req, res, req.body.vat,false,client.locale) : false;
            let vatPercentageCheck = invalid.valueMustBeAnInteger(req, res, req.body.vatPercentage, true);
            let bankCheck = (req.body.bankNr) ? invalid.valueMustBeValidIban(req, res, req.body.bankNr) : false;
            let placeCheck = (req.body.place) ? invalid.valueMustBeAName(req, res, req.body.place, true, "place name not correctly checked in") : false;
            let isNotValid = nameCheck || firmCheck || streetCheck || vatPercentageCheck || streetNrCheck || emailCheck || vatCheck || bankCheck || placeCheck;
            if (!isNotValid) {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' body valid for creating a client");
                let updatedClient = {
                    clientName: req.body.clientName,
                    firm: req.body.firm,
                    street: req.body.street,
                    streetNr: req.body.streetNr,
                    email: emails,
                    vat: (req.body.vat)?invalid.formatBEVat(req.body.vat):"",
                    vatPercentage: req.body.vatPercentage,
                    bankNr: (req.body.bankNr)?invalid.formatBEIban(req.body.bankNr):"",
                    postalCode: req.body.postalCode,
                    place: req.body.place,
                    lastUpdated:Date.now()
                };
                Client.updateOne({fromUser: req.session._id, _id: client._id}, updatedClient, async (err) => {
                    error.handler(req,res,err,'1C0501');
                    if (!error.updateOneHasError(req, res, err)) {
                        await activity.editedClient(client,req.session._id);
                        req.flash("success", i18n.__("Successfully updated client"));
                        res.redirect("back");
                    }
                });
            } else {
                logger.info.log("[INFO]: Email:\'"+req.session.email+"\' body not valid for creating a client");
                res.redirect("/edit/client/" + client._id);
            }
        }
    });
};