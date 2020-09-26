const logoutController = require('../controllers/logoutController');
const Settings = require('../models/settings');
const i18n = require('i18n');
const logger = require("./logger");
const {getIp} = require("../utils/utils");
const User = require('../models/user');
const Error = require('../middlewares/error');
const Invoice = require('../models/invoice');
/**
 * @apiVersion 3.0.0
 * @apiDefine stillSignedInCheck session checker for sign in
 * checks if you are still signed and the session still exists
 * @apiGroup Middleware
 */
exports.stillSignedInCheck = (req, res, next) => {
    if (!req.session._id) {
        logger.warning.log("[WARNING]: Session timeout or removed at ip "+getIp(req)+", logging out...");
        return logoutController.logoutGet(req, res);
    }
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (err) {
            logger.error.log("[ERROR]: thrown at /src/middlewares/checkers.stillSignedInCheck on method Settings.findOne trace: "+err.message);
            req.flash('danger', i18n.__("couldn't find user"));
            req.redirect('/');
        }
        req.locale = settings.locale;
        i18n.setLocale(req, settings.locale);
        i18n.setLocale(res, settings.locale);
        req.setLocale(settings.locale);
        res.locals.language = settings.locale;
        next();
    });
};

exports.checkIfAdminRole = async (req,res,next) => {
  let user = await User.findOne({_id:req.session._id},(err,user)=>{
      Error.handler(req,res,err,"A9F100");
      return user;
  });
  if(user && user.role && user.role==="admin"){
      next();
  }else{
      req.flash('warning',"You are not allowed there");
      req.session = {};
      res.redirect('/');
  }
};

exports.checkIfAdminOrSupportRole = async (req,res,next) => {
    let user = await User.findOne({_id:req.session._id},(err,user)=>{
        Error.handler(req,res,err,"A9F100");
        return user;
    });
    if(user && user.role && user.role==="admin" || user.role==='support'){
        next();
    }else{
        req.flash('warning',"You are not allowed there");
        req.session = {};
        res.redirect('/');  
    }
};

exports.checkIfCreditPaid = async (req,res,next) => {
    let invoice = await Invoice.findOne({_id:req.params.idi,fromUser:req.session._id});
    if(!invoice){
        req.flash('danger','No invoice found, please try again or report a bug');
        res.redirect('back');
        return;
    }
    if(!invoice.isCreditPaid){
        let user = await User.findOne({_id:req.session._id});
        if(user.credits < 1){
            req.flash('warning',i18n.__("You do not have any credits left to pay for this invoice. Please purchase more."));
            res.redirect('back');
            return;
        }else if(user.credits > 1){
            await Invoice.updateOne({_id:req.params.idi,fromUser:req.session._id},{isCreditPaid:true});
            await User.updateOne({_id:req.session._id},{credits:user.credits-1});
            req.flash('success',i18n.__('Successfully paid 1 CR for this invoice'));
        }
    }
    next();
};
