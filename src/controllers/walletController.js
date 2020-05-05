const M = require('../utils/mongooseSchemas');
const paypal = require('paypal-rest-sdk');
const i18n = require('i18n');
const logger = require("../middlewares/logger");

exports.getPaymentSuccessPaypal = async (req,res) => {
  console.log('successs');
  let user = User.findOne({_id:req.session._id});
  await User.updateOne({_id:req.session._id},{credits:user.credits+req.session.amount});
  req.session.amount = null;
  req.flash('success',i18n.__('You successfully purchased credits'));
  res.redirect('/wallet');
};

exports.getPaymentErrorPaypal = async (req,res) => {
  console.log('error');
  req.flash('danger',i18n.__('Something happend with the payment, error code: AD19F'));
  res.redirect('/wallet');
};

exports.getPaymentCancelPaypal = async (req,res) => {
  console.log('canceled');
  req.flash('danger',i18n.__('The payment was canceled. If you think this is a mistake, please create a ticket at support'));
  res.redirect('/wallet');
};

exports.getMainPage = async (req,res) => {
  let settings = await new M.settings().findOne(req,res,{fromUser:req.session._id});
  let user = await new M.user().findOne(req,res,{_id:req.session._id});
  let profile = await new M.profile().findOne(req.res,{fromUser:req.session._id});
  res.render('wallet',
      {
        'settings':settings,
        'role':user.role,
        'credits':user.credits,
        'profile':profile,
        'currentUrl':"wallet",
      }
  )
};


exports.getPaymentProcessPaypal = async (req,res) => {
  console.log('processing...');
  let amount = req.query.amount;
  logger.info.log('[INFO]: User '+req.session.email+' is trying to make payment for '+(amount*2)+" CR");
  let create_payment_json;
  if(process.env.DEVELOP==='true') {
    create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": process.env.PAYPAL_REDIRECT_URL_DEVELOP+"/success",
        "cancel_url": process.env.PAYPAL_REDIRECT_URL_DEVELOP+"/error"
      },
      "transactions": [{
        "amount": {
          "total": String(amount)+'.00',
          "currency": "EUR"
        },
        "description": "Purchase of "+amount+" CR to invoice-administration (sandbox mode on)"
      }]
    }
  }else{
    create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": process.env.PAYPAL_REDIRECT_URL+"/success",
        "cancel_url": process.env.PAYPAL_REDIRECT_URL+"/cancel"
      },
      "transactions": [{
        "amount": {
          "total": amount,
          "currency": "EUR"
        },
        "description": "Purchase of "+amount+" CR to invoice-administration"
      }]
    }
  }
  console.log(create_payment_json);
  paypal.payment.create(create_payment_json, (error,payment) =>{
    if(error){
      console.trace(error);
      logger.error.log('[ERROR]: User '+req.session.email+' canceled or did not make payment');
      res.redirect('/wallet/error');
    }else{
      logger.info.log('[INFO]: User '+req.session.email+' payment successfull');
      req.session.amount = amount;
      console.log(payment);
      let redirectUrl = '/wallet/error';
      for(let i=0; i < payment.links.length; i++) {
        let link = payment.links[i];
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href;
        }
      }
      res.redirect(redirectUrl);
    }
  });
};