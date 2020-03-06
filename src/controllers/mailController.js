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

exports.sendAttachment = async (req,res) => {
    req.flash('warning',"This option is not available yet");
    res.redirect('back');
    let user = await User.findOne({_id:req.session._id},(err,user) => {return user;});
    let nr = await getDefaultNumberOfInvoice(await Invoice.findOne({_id:req.params.idi,fromUser:req.session._id},(err,invoice) => {return invoice}));
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        Invoice.findOne({fromUser: req.session._id, _id: req.params.idi}, function (err, invoice) {
            Client.findOne({fromUser: req.session._id, _id: invoice.fromClient}, function (err, client) {
                Order.find({fromUser: req.session._id, fromInvoice: invoice._id}, function (err, orders) {
                    Settings.findOne({fromUser: req.session._id}, async (err, settings) => {
                        if (!err) {
                            let type = await getOnlyTypeOfInvoice(invoice);
                            await createPDF(req, res, type, profile, settings, client, invoice, orders,true,true);
                            mailgun.sendAttachment(user.email,getPathOfInvoice(req.session._id,invoice),nr.toString());
                        }
                    });
                });
            });
        });
    });
    req.flash('success',i18n.__("Your PDF has mailed to your email"));
    res.redirect('back');
};

exports.sendBugReport = async (req,res) => {
  let user = await User.findOne({_id:req.session._id},(err,user)=>{return user;});
  await mailgun.sendMessageRichData("snakehead007@pm.me",req.body.message,req.session._id,user);
  req.flash('success',i18n.__("Your bug report has been send, thank you!"));
  res.redirect('back');
};