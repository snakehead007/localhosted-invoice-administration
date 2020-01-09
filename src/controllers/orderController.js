const Order = require('../models/order');
const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Profile = require('../models/profile');

exports.edit_order_get = (req,res)  => {
    Order.findOne({fromUser:req.session._id,_id: req.params.ido}, function(err, order) {
        if(err) console.log("[ERROR]: "+err);
        Invoice.findOne({fromUser:req.session._id,_id: order.fromInvoice}, function(err, invoice) {
            if(err) console.log("[ERROR]: "+err);
            Settings.findOne({fromUser:req.session._id,}, function(err, settings) {
                if(err) console.log("[ERROR]: "+err);
                Profile.findOne({fromUser:req.session._id,}, function(err, profile) {
                    if(err) console.log("[ERROR]: "+err);
                    if (!err) {
                        res.render('/edit/edit-order', {
                            'order': order,
                            "invoice": invoice,
                            "profile":  profile,
                            "settings": settings,
                        });
                    }
                });
            });
        });
    });
};

exports.new_order_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if(err) console.log("[ERROR]: "+err);
        if (!err) {
            Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client){
                if(err) console.log("[ERROR]: "+err);
                if(!err){
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if(err) console.log("[ERROR]: "+err);
                        if (!err) {
                            Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                                if(err) console.log("[ERROR]: "+err);
                                if (!err) {
                                    res.render('/new/new-order', {
                                        'invoice': invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "contact":contact
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.new_order_post = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi},function(err,invoice){
    let newOrder = new Order({
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        invoice: req.body.idi,
        total: req.body.aantal * req.body.bedrag,
        fromUser:req.session._id,
        fromClient:invoice.fromClient
    });
    newOrder.save();
    let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
    invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, {total:totInvoice},function(){
        res.redirect('/invoice/' + req.params.idi);
    });
    });
};

exports.all_order_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if(err) console.log("[ERROR]: "+err);
        if (!err) {
            Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
                if(err) console.log("[ERROR]: "+err);
                if (!err) {
                    Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client) {
                        if(err) console.log("[ERROR]: "+err);
                        Settings.findOne({}, function (err, settings) {
                            if(err) console.log("[ERROR]: "+err);
                            if (!err) {
                                Profile.findOne({fromUser:req.session._id}, function (err, profile) {
                                    if(err) console.log("[ERROR]: "+err);
                                    if (!err) {
                                        res.render('orders', {
                                            'invoice': invoice,
                                            'orders': orders,
                                            "profile": profile,
                                            "client": client,
                                            "settings": settings,
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
};