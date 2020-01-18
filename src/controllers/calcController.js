/**
 * Calculations Controller
 * @module controllers/calcController
 */
const Profile = require('../models/profile');
const Settings = require('../models/settings');
/**
 *  GET request, gives list of all calulations
 *  renders view/calc
 * @alias module:/controllers/calcController.calc_all_get
 * @param req {Object} request - request of express
 * @param res {Object} response - response of express
 */
exports.calc_all_get = (req,res) =>{
    Profile.findOne({fromUser:req.session._id},function(err,profile){
        Settings.findOne({fromUser:req.session._id}, function(err, settings) {
            res.render('calc', {
                'currentUrl':'calc',
                'settings': settings,
                'description': "Settings",
                'profile':profile
            });
        });
    });
};