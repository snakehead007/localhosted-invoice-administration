/**
 * @module controllers/clientController
 */

const Profile = require('../models/profile');
const Client = require('../models/client');
const Settings = require('../models/settings');

/**
 *
 * @param req
 * @param res
 */
exports.client_all_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        if(err) console.trace();
        Client.find({fromUser:req.session._id}, function(err, clients) {
            if(err) console.trace();
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.trace();
                if (!err ) {
                    res.render('clients', {
                        'clients': clients,
                        "settings": settings,
                        "profile":profile,
                        "currentUrl":"clientAll"
                    });
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
exports.client_new_get = (req,res) => {
    Settings.findOne({},function(err, settings) {
        if(err) console.trace();
        Profile.findOne({},function(err,profile) {
            if(err) console.trace();
            if (!err) {
                res.render('new/new-client', {
                    "settings": settings,
                    "profile":profile,
                    "currentUrl":"clientNew"
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
exports.client_new_post = (req,res) => {
    if (
        req.body.clientName &&
        req.body.street &&
        req.body.place) {
        let newClient = new Client({
            firm: req.body. firm,
            clientName: req.body.clientName,
            street: req.body.street,
            streetNr: req.body.streetNr,
            postal: req.body.postal,
            place: req.body.place,
            vat: req.body.vat,
            lang: req.body.lang,
            email: [req.body.mail],
            bankNr: req.body.rekeningnr,
            fromUser:req.session._id,
            invoices:[]
        });
        newClient.save();
        res.redirect('/client/all');
    }
};

/**
 *
 * @param req
 * @param res
 */
exports.view_client_get = (req,res) => {
    Client.findOne({fromUser:req.session._id,_id: req.params.idc}, function(err, client) {
        if (!err) {
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if (!err) {
                    Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                        if (!err) {
                            res.render('view/view-client', {
                                'client': client,
                                "profile": profile,
                                "settings": settings
                            });
                        }
                    });
                }
            });
        }
    });
};
