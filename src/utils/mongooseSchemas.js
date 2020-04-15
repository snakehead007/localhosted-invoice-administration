//models
const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
const Activity = require('../models/activity');
const Client = require('../models/client');
const Item = require('../models/item');
const Order = require('../models/order');
const Settings = require('../models/settings');
const User = require('../models/user');
const Whitelist = require('../models/whitelist');

//utils
const logger = require('../middlewares/logger');
const Error = require('../middlewares/error');

//profile
exports.profile = class profile {
    findOne = async (req,res,identifier,extra=null,sort=null) => {
        return await Profile.findOne(identifier,extra,sort,(err,profile)=>{
            Error.handler(req,res,err,'7M0P00');
            return profile;
        });
    }
};

//client
exports.client = class client{
  findOne = async (req,res,identifier,extra=null,sort=null) => {
      return await Client.findOne(identifier,extra,sort,(err,client) => {
          Error.handler(req,res,err,'7M1C00');
          return client;
      })
  };
    find = async (req,res,identifier,extra=null,sort=null) => {
        return await Client.find(identifier,extra,sort,(err,clients) => {
            Error.handler(req,res,err,'7M1C01');
            return clients;
        })
    }
};

//settings
exports.settings = class settings{
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await Settings.findOne(identifier,extra,sort,(err,settings)=>{
           Error.handler(req,res,err,'7M2S00') ;
           return settings;
        });
    }
};

//user
exports.user = class user{
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await User.findOne(identifier,extra,sort,(err,user)=>{
            Error.handler(req,res,err,'7M3U00') ;
            return user;
        });
    }
    find = async (req,res,identifier,extra=null,sort=null)=>{
        return await User.find(identifier,extra,sort,(err,invoices)=>{
            Error.handler(req,res,err,'7M4I01') ;
            return invoices;
        });
    }
};

exports.invoice = class invoice{
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await Invoice.findOne(identifier,extra,sort,(err,invoice)=>{
            Error.handler(req,res,err,'7M4I00') ;
            return invoice;
        });
    }
    find = async (req,res,identifier,extra=null,sort=null)=>{
        return await Invoice.find(identifier,extra,sort,(err,invoices)=>{
            Error.handler(req,res,err,'7M4I01') ;
            return invoices;
        });
    }
}

exports.order = class order{
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await Order.findOne(identifier,extra,sort,(err,order)=>{
            Error.handler(req,res,err,'7M5O00') ;
            return invoice;
        });
    }
    find = async (req,res,identifier,extra=null,sort=null)=>{
        return await Order.find(identifier,extra,sort,(err,invoices)=>{
            Error.handler(req,res,err,'7M5O01') ;
            return invoices;
        });
    }
}

exports.activity = class activity{
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await Activity.findOne(identifier,extra,sort,(err,activity)=>{
            Error.handler(req,res,err,'7M6A00') ;
            return activity;
        });
    }
    find = async (req,res,identifier,extra=null,sort=null)=>{
        return await Activity.find(identifier,extra,sort,(err,activities)=>{
            Error.handler(req,res,err,'7M6A01') ;
            return activities;
        });
    }
}

exports.whitelist = class whitelist {
    findOne = async (req,res,identifier,extra=null,sort=null)=>{
        return await Whitelist.findOne(identifier,extra,sort,(err,whitelist)=>{
            Error.handler(req,res,err,'7M7W00') ;
            return whitelist;
        });
    }
    find = async (req,res,identifier,extra=null,sort=null)=>{
        return await Whitelist.find(identifier,extra,sort,(err,whitelists)=>{
            Error.handler(req,res,err,'7M7W01') ;
            return whitelists;
        });
    }
}