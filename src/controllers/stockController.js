const Settings = require("../models/settings");
const Item = require("../models/item");
const Profile = require("../models/profile");

/**
 * @api {get} /stock/all stock_all_get
 * @apiName stock_all_get
 * @apiDescription Renders the stock with all Items sorted by name
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        "currentUrl":"stock",
        "stock": stock,
        "settings": settings,
        "profile":profile
    }
 */
exports.stockAllGet = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if (!err) {
            Item.find({fromUser:req.session._id}).sort("name").exec(function(err, stock) {
                if (!err) {
                    Profile.findOne({fromUser:req.session._id},async(err,profile)=>{
                        if(!err) {
                            res.render("stock", {
                                "currentUrl":"stock",
                                "stock": stock,
                                "settings": settings,
                                "profile":profile,
                                "role":(await User.findOne({_id:req.session._id},(err,user)=> {return user})).role
                            });
                        }
                    });
                }
            });
        }
    });
};
/**
 * @api {get} /stock/new/item stock_new_item_get
 * @apiName stock_new_item_get
 * @apiDescription renders new/new-item, here the user can create a new item
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        "settings": settings,
        "profile": profile,
        "currentUrl":"stockNew"
    }
 */
exports.stockNewItemGet = (req,res) =>{
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace(err);
        if (!err) {
            Profile.findOne({fromUser:req.session._id},async(err,profile) =>{if(!err){
                res.render("new/new-item", {
                    "settings": settings,
                    "profile": profile,
                    "currentUrl":"stockNew",
                    "role":(await User.findOne({_id:req.session._id},(err,user) => {return user})).role
                });
            }});
        }
    });
};
/**
 * @api {get} /stock/new/item stock_new_item_get
 * @apiName stock_new_item_get
 * @apiDescription renders new/new-item, here the user can create a new item
 * @apiGroup Settings
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        "settings": settings,
        "profile": profile,
        "currentUrl":"stockNew"
    }
 */
exports.stockNewItemPost = (req,res) => {
    let new_item = new Item({
        price: req.body.price,
        name: req.body.name,
        amount: req.body.amount,
        fromUser:req.session._id
    });
    new_item.save();
    res.redirect("/stock/all");
};