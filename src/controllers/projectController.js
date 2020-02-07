/**
 * @module controllers/projectController
 * @file controllers/projectController
 */

const Settings = require('../models/settings');
const Profile = require('../models/profile');
const Project = require('../models/project');

exports.project_all_get = (req,res) => {
    Settings.findOne({fromUser: req.session._id},function(err,settings){
        if(err){console.log("err:"+err)}
        Profile.findOne({fromUser: req.session._id},function(err,profile){
            if(err){console.log("err:"+err)}
            Project.find({fromUser: req.session._id},function(err,projects){
                if(err){console.log("err:"+err)}
                res.render(settings.lang+'/project',{
                    'settings': settings,
                    'profile':profile,
                    "projects":projects
                });
            });
        });
    });
};