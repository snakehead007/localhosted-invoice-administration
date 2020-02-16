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
/**
 *
 * @param req
 * @param res
 */
exports.delete_client = (req,res) =>{
    Client.deleteOne({fromUser:req.session._id,_id: req.params.idc}, function(err) {
        if(err) console.trace();
        if (!err) {
            Invoice.deleteMany({fromUser:req.session._id,fromClient: req.params.idc},function(err){
                if(err) console.trace();
                Client.find({fromUser:req.session._id}, function(err){
                    if(err) console.trace();
                    if(!err) {
                        res.redirect('client/all');
                    }
                });
            });
        }
    });
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