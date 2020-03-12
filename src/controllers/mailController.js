const User = require('../models/user');
const Profile = require("../models/profile");
const Invoice = require("../models/invoice");
const Order = require("../models/order");
const Settings = require("../models/settings");
const i18n = require('i18n');
const Client = require("../models/client");
const mailgun = require('../utils/mailgun');
const {createPDF} = require("../utils/pdfGenerator");
const {getPathOfInvoice,getOnlyTypeOfInvoice,getDefaultNumberOfInvoice} = require('../utils/invoices');
const {getIp} = require("../utils/utils");
const logger = require("../middlewares/logger");

exports.sendToBasecone = async (req,res) => {
    logger.warning.log("[WARNING]: Email:\'"+req.session.email+"\' tried to send attachment via mail.");
    let user = await User.findOne({_id:req.session._id},(err,user) => {return user;
    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method User.findOne trace: "+err.message);});
    let nr = await getDefaultNumberOfInvoice(await Invoice.findOne({_id:req.params.idi,fromUser:req.session._id},(err,invoice) => {return invoice;
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Invoice.findOne trace: "+err.message);}));
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Profile.findOne trace: "+err.message);
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Invoice.findOne trace: "+err.message);
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Client.findOne trace: "+err.message);
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Order.find trace: "+err.message);
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Settings.findOne trace: "+err.message);
                        if (!err) {
                            if(!settings.baseconeMail){
                                req.flash("warning",i18n.__("No basecone mail found, add one in the settings"));
                                res.redirect('back');
                                return;
                            }
                            try {
                                let type = await getOnlyTypeOfInvoice(invoice);
                                await createPDF(req, res, type, profile, settings, client, invoice, orders, true, true);
                                mailgun.sendToBasecone(user.email,settings.baseconeMail, getPathOfInvoice(req.session._id, invoice), nr.toString(),req.body.subject,req.body.description);
                                Invoice.updateOne({fromUser:req.session._id,_id:req.params.idi},{isSendToBasecone:true},(err)=>{
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method Invoice.updateOne trace: "+err.message);
                                });
                                req.flash('success',i18n.__("Your invoice has been sent to Basecone"));
                            }catch(err){
                                logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on catch block trace: "+err.message);
                                req.flash('warning',i18n.__("This option is only available if you contact the administrator"));
                            }finally {
                                Invoice.updateOne({fromUser:req.session._id,_id:req.params.idi},{isSendToBasecone:true},(err)=>{
                                    if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on Invoice.updateOne trace: "+err.message)
                                });
                                res.redirect('back');
                            }
                        }
                    });
                });
            });
        });
    });
};
exports.sendBugReport = async (req,res) => {
    let user = await User.findOne({_id:req.session._id},(err,user)=>{return user;
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on method User.findOne trace: "+err.message);});
    try {
        await mailgun.sendBugReport("snakehead007@pm.me", req.body.message, req.session._id, user, getIp(req));
    }catch(err){
        if(err) logger.error.log("[ERROR]: thrown at /src/controllers/mailController.sendAttachment on catch block trace: "+err.message);
        req.flash('danger',i18n.__("Something happend, please try again"));
        res.redirect('back');
        return;
    }
    logger.info.log("[INFO]: Email:\'"+req.session.email+"\' send bug report");
    req.flash('success',i18n.__("Your bug report has been send, thank you!"));
    res.redirect('back');
};
