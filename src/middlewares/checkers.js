const logoutController = require('../controllers/logoutController');
const Settings = require('../models/settings');
const i18n = require('i18n');
const logger = require("./logger");
const {getIp} = require("../utils/utils");
const User = require('../models/user');
const Error = require('../middlewares/error');
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