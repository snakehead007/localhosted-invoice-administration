const Activity = require('../models/activity');
const User = require('../models/user');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
exports.getActivity = async (req,res) => {
    const activities = await Activity.find({fromUser:req.session._id}).sort({ creationDate: 1 }).exec((err,activities) => {return activities});
    const role = (await User.findOne({_id: req.session._id}, (err, user) => {return user})).role;
    const profile = await Profile.findOne({fromUser:req.session._id}, (err,profile) => { return profile});
    const settings = await Settings.findOne({fromUser:req.session._id}, (err,settings) => { return settings});
    res.render('activities',{
        "settings":settings,
        "role":role,
        "profile":profile,
        "currentUrl":"activities",
        "activities":activities
    })

};

exports.getUndoActivity = (req,res) => {
    req.flash('danger',"this url doesnt work yet");
    res.redirect('/dashboard');
};