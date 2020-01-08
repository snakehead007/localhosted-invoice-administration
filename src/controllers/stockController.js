const Settings = require('../models/settings');
const Item = require('../models/item');
const Profile = require('../models/profile');

exports.stock_all_get = (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if (!err) {
            Item.find({fromUser:req.session._id}).sort('name').exec(function(err, stock) {
                if (!err) {
                    Profile.findOne({fromUser:req.session._id},function(err,profile){
                        if(!err) {
                            res.render('stock', {
                                'stock': stock,
                                'settings': settings,
                                "profile":profile
                            });
                        }
                    });
                }
            });
        }
    });
};