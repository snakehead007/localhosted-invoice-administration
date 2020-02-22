/**
 * Calculations Controller
 * Here all the methods are written for /calc
 */

const Profile = require('../models/profile');
const Settings = require('../models/settings');
/**
 * @api {get} /calc/all getCalcAll
 * @apiDescription Here you can view all the calculations and navigate to the specific one.
 * @apiName getCalcAll
 * @apiGroup Calc
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      'currentUrl':'calc',
        'settings': settings,
        'description': "Settings",
        'profile':profile
 *  }
 */
exports.getCalcAll = (req, res) => {
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        Settings.findOne({fromUser: req.session._id}, function (err, settings) {
            res.render('calc', {
                'currentUrl': 'calc',
                'settings': settings,
                'description': "Settings",
                'profile': profile
            });
        });
    });
};