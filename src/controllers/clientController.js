const Profile = require('../models/profile');
const Client = require('../models/client');
const Settings = require('../models/settings');

exports.client_all_get = (req,res) => {
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        if(err) console.log("[ERROR]: "+err);
        Client.find({fromUser:req.session._id}, function(err, clients) {
            if(err) console.log("[ERROR]: "+err);
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if(err) console.log("[ERROR]: "+err);
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

exports.client_new_get = (req,res) => {
    Settings.findOne({},function(err, settings) {
        if(err) console.log("[ERROR]: "+err);
        Profile.findOne({},function(err,profile) {
            if(err) console.log("[ERROR]: "+err);
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
