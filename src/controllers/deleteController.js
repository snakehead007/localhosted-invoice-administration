const Client = require('../models/client');
const Invoice = require('../models/invoice');
const Order = require('../models/order');
exports.delete_client = (req,res) =>{
    Client.deleteOne({fromUser:req.session._id,_id: req.params.idc}, function(err) {
        if(err) console.trace();
        if (!err) {
            Invoice.deleteMany({fromUser:req.session._id,fromClient: req.params.idc},function(err){
                if(err) console.trace();
                Client.find({fromUser:req.session._id}, function(err){
                    if(err) console.trace();
                    if(!err) {
                        res.redirect('/client/all');
                    }
                });
            });
        }
    });
};

exports.delete_invoice_get = (req,res) => {
    Invoice.deleteOne({fromUser:req.session._id,_id:req.params.idi},function(err){
        if(err) console.trace(err);
        Order.deleteMany({fromInvoice:req.params.idi,fromUser:req.session._id},function(err){
            if(err) console.trace(err);
            res.redirect('/invoice/all');
        });
    });
};