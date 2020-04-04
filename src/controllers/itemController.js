/**
 * @module controller/itemController
 */
const Settings = require("../models/settings");
const Item = require("../models/item");
const Error = require('../middlewares/error');
const Profile = require("../models/profile");
/**
 *
 * @param req
 * @param res
 */
exports.editItemGet = (req, res) => {
    Settings.findOne({fromUser: req.session._id}, function (err, settings) {
        if (err) {
            Error.handler(req,res,err,'6I0000');
        }
        if (!err) {
            Item.findOne({fromUser: req.session._id, _id: req.params.idi,isRemoved:false}, function (err, item) {
                if (err) {
                    Error.handler(req,res,err,'6I0001');
                }
                Profile.findOne({}, function (err, profile) {
                    if (err) {
                        Error.handler(req,res,err,'6I0002');
                    }
                    if (!err) {
                        res.render("edit/edit-item", {
                            "settings": settings,
                            "item": item,
                            "profile": profile,
                        });
                    }
                });
            });
        }
    });
};