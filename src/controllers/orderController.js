const Order = require('../models/order');
const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Profile = require('../models/profile');
const Client = require('../models/client');
exports.edit_order_get = (req,res)  => {
    Order.findOne({fromUser:req.session._id,_id: req.params.ido}, function(err, order) {
        if(err) console.trace();
        Invoice.findOne({fromUser:req.session._id,_id: order.fromInvoice}, function(err, invoice) {
            if(err) console.trace();
            Settings.findOne({fromUser:req.session._id,}, function(err, settings) {
                if(err) console.trace();
                Profile.findOne({fromUser:req.session._id,}, function(err, profile) {
                    if(err) console.trace();
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
        if(err) console.trace();
        if (!err) {
            Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client){
                if(err) console.trace();
                if(!err){
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if(err) console.trace();
                        if (!err) {
                            Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                                if(err) console.trace();
                                if (!err) {
                                    res.render('new/new-order', {
                                        'invoice': invoice,
                                        "profile": profile,
                                        "settings": settings,
                                        "client": client,
                                        "currentUrl":"orderNew"
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

exports.new_order_post = async (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi},async function(err,invoice){
    let newOrder = new Order({
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price,
        invoice: req.params.idi,
        total: req.body.amount * req.body.price ,
        fromUser:req.session._id,
        fromClient:invoice.fromClient,
        fromInvoice:req.params.idi
    });
    await newOrder.save();
    let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
    await invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, {total:totInvoice});
    res.redirect('/order/all/' + req.params.idi);
    });
};

exports.all_order_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if(err) console.trace();
        if (!err) {
            Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
                if(err) console.trace();
                if (!err) {
                    Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client) {
                        if(err) console.trace();
                        Settings.findOne({}, function (err, settings) {
                            if(err) console.trace();
                            if (!err) {
                                Profile.findOne({fromUser:req.session._id}, function (err, profile) {
                                    if(err) console.trace();
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

exports.view_order_get = (req,res) => {
    Order.findOne({fromUser:req.session._id,_id: req.params.ido}, function(err, order) {
        if (!err) {
            Invoice.findOne({fromUser:req.session._id,_id: order.factuur}, function(err, invoice) {
                if (!err) {
                    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                        if (!err) {
                            Profile.findOne({fromUser:req.session._id}, function(err, profile) {
                                if (!err) {
                                    res.render('view/view-order', {
                                        'order': order,
                                        "invoice": invoice,
                                        "profile": profile,
                                        "settings": settings,
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