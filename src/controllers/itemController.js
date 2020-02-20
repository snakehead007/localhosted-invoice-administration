/**
 * @module controller/itemController
 */
const Settings = require('../models/settings");
const Item = require("../models/item");
const Profile = require("../models/profile");
/**
 *
 * @param req
 * @param res
 */
exports.edit_item_get =  (req,res) => {
    Settings.findOne({fromUser:req.session._id}, function(err, settings) {
        if(err) console.trace();
        if (!err) {
            Item.findOne({fromUser:req.session._id,_id: req.params.idi}, function(err, item) {
                if(err) console.trace();
                Profile.findOne({}, function(err, profile) {
                    if(err) console.trace();
                    if (!err) {
                        res.render("edit/edit-item", {
                            "settings": settings,
                            "item": item,
                            "profile":profile,
                        });
                    }
                });
            });
        }
    });
};