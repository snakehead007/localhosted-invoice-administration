/**
 * @module controller/deleteController
 */

const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
const Profile = require('../models/profile');
const fs = require('fs');
const i18n = require('i18n');
const path = require('path');
const error = require('../middlewares/error');
/**
 *
 * @param req
 * @param res
 */
exports.delete_client = (req,res) =>{
    Client.find({fromUser:req.session._id,_id:req.params.idc},(err,client) =>{
        if(!error.findOneHasError(req,res,err,client)){
            Invoice.deleteMany({fromUser:req.session._id,fromClient:client._id},(err) => {
                if(!err){
                    Order.deleteMany({fromUser:req.session._id,fromClient:client._id},(err) => {
                        if(!err){
                            Client.deleteOne({fromUser:req.session._id,_id:req.params.idc},(err) => {
                                if(!err){
                                    req.flash('success','Successfully deleted the client');
                                    res.redirect('/client/all');
                                }
                            });
                        }
                    })
                }
            })
        }
    })
};

/**
 *
 * @param req
 * @param res
 */
exports.delete_invoice_get = (req,res) => {
    Invoice.deleteOne({fromUser:req.session._id,_id:req.params.idi},function(err){
        if(err) console.trace(err);
        Order.deleteMany({fromInvoice:req.params.idi,fromUser:req.session._id},function(err){
            if(err) console.trace(err);
            res.redirect('/invoice/all');
        });
    });
};

exports.delete_logo_get = (req,res) => {
    let pathOfLogo = path.join(__dirname,'../../public/images/'+req.session._id+'/logo.jpeg');
    console.log('[Debug]: trying to delete logo at path '+pathOfLogo);
    fs.access(pathOfLogo, fs.F_OK, (err) => {
        if (err) {
            req.flash('warning',i18n.__("There is no logo to delete"));
            res.redirect('/view/profile');
        }else{
            fs.unlink(pathOfLogo, async (err) => {
                if(err){
                    req.flash('danger',i18n.__("Error, something went wrong"));
                    res.redirect('/view/profile');
                }else{
                    let updatedLogoFile = {
                        logoFile:{
                            data:null,
                            contentType:""
                        }
                    };
                    await Profile.updateOne({fromUser:req.session._id},updatedLogoFile,function(err){
                        if(err) console.trace(err);
                    });
                    req.flash('success',i18n.__('Successfully deleted your current logo'));
                    res.redirect('/view/profile');
                }
            });
        }
    })
};

exports.delete_order_get = (req,res) => {
    Order.findOne({fromUser:req.session._id,_id:req.params.ido},(err,order)=> {
        if(!error.findOneHasError(req,res,err,order)){
            Invoice.findOne({fromUser:req.session._id,_id:order.fromInvoice}, (err,invoice) => {
                if(!error.findOneHasError(req,res,err,invoice)){
                    let updateInvoice = {
                        total: invoice.total - (order.amount * order.price)
                    };
                    Order.deleteOne({fromUser:req.session._id,_id:order._id}, (err)=> {
                        if(err) console.trace("[Error]: "+err);
                        Invoice.updateOne({fromUser:req.session._id,_id:invoice._id},updateInvoice,(err) => {
                            if(err) console.trace("[Error]: "+err);
                            req.flash('success',i18n.__("Successfully deleted the order"));
                            res.redirect('/order/all/'+invoice._id);
                        })
                    });
                }
            })
        }
    })
};