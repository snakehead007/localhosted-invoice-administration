/**
 * @module controllers/orderController
 */
const Order = require('../models/order');
const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const Profile = require('../models/profile');
const Client = require('../models/client');

const {findOneHasError} = require('../middlewares/error');
/**
 *
 * @param req
 * @param res
 */
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
                        res.render('edit/edit-order', {
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

/**
 *
 * @param req
 * @param res
 */
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

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.new_order_post = async (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id:req.params.idi}, async function(err,invoice){
        let newOrder = new Order({
            description: req.body.description,
            amount: req.body.amount,
            price: req.body.price,
            total: req.body.amount * req.body.price ,
            fromUser:req.session._id,
            fromClient:invoice.fromClient,
            fromInvoice:req.params.idi
        });
        await newOrder.save();
        let totInvoice = ((((invoice.total + invoice.advance) + (req.body.amount * req.body.price)) - invoice.advance));
        console.log("total invoice:" +totInvoice);
        await Invoice.updateOne({fromUser:req.session._id,_id: req.params.idi}, {total:totInvoice,lastUpdated:Date.now()},function(err,invoice){
            console.log(invoice);
            if(err) console.trace(err);
        });
        res.redirect('/order/all/' + req.params.idi);
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.all_order_get = (req,res) => {
    Invoice.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, invoice) {
        if(err) console.trace();
        if (!err) {
            Order.find({fromUser:req.session._id,fromInvoice: req.params.idi}, function(err, orders) {
                if(err) console.trace();
                if (!err) {
                    console.log("Trying to find Client with id: "+ invoice);
                    Client.findOne({fromUser:req.session._id,_id:invoice.fromClient},function(err,client) {
                        if(err) console.trace();
                        Settings.findOne({fromUser:req.session._id}, function (err, settings) {
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

/**
 *
 * @param req
 * @param res
 */
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

exports.edit_order_post = (req,res) =>
{
    console.log('EDIT ORDER POST: '+req.session._id+", "+req.params.ido);
    Order.findOne({fromUser:req.session._id,_id: req.params.ido}, function (err, order) {
        if(!findOneHasError(req,res,err,order)){
            let updateOrder = {
                description: req.body.description,
                amount: req.body.amount,
                price: req.body.price,
                total: req.body.price * req.body.amount,
                lastUpdated: Date.now()
            };
            Invoice.findOne({fromUser: req.session._id, _id: order.fromInvoice}, async function (err, invoice) {
                await Order.updateOne({fromUser: req.session._id, _id: req.params.ido}, updateOrder);
                //total of the invoice minus old order total minus the advance
                let tot = invoice.total - (order.amount * order.price) - invoice.advance;
                console.log("total: "+tot);
                let updateInvoice = {
                    //total of new invoice = total above + new total of order + the advance of the total
                    total: ((tot + (req.body.amount * req.body.price) + invoice.advance)),
                    lastUpdated: Date.now()
                };
                console.log("updating invoice : "+JSON.stringify(updateInvoice));
                Invoice.updateOne({fromUser: req.session._id, _id: order.fromInvoice}, updateInvoice, function (err) {
                    if (err) {
                        console.trace(err);
                    }
                    res.redirect('/order/all/'+invoice._id);
                });
            });
        }
    });
};

exports.delete_order_get = (req,res) => {
    throw new Error('Not yet implemented');
};