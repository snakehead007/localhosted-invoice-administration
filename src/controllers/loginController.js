/**
 * @module controllers/loginController
 */

const google = require('../middlewares/google');
const User = require('../models/user');
const Settings = require('../models/settings');
const Profile = require('../models/profile');

/**
 *
 * @param req
 * @param res
 */
exports.login_get =  function getLogin(req,res){
    //req.session;

    //This is would redirect if session was already created
    /*if(req.session&&req.session._id){
        return res.redirect('/dashboard');
    }*/
    req.session.regenerate(function(err) {
        // will have a new session here

        res.render('login');
    });
    //res.render('login');
};
/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create_user_get = async function getCreateNewUser(req,res){
    if(process.env.DEVELOP==="true" && process.env.DEVELOP_WITH_GOOGLE==="false"){
        const googleId = Math.floor((Math.random() * 99999999999999999999999999999999999) + 10000000000000000000000000000000000);
        const email = Math.floor((Math.random() * 99999999999999999999999999999999999) + 10000000000000000000000000000000000);;
        const newUser = new User({
            googleId: googleId,
            email: email,
            tokens:{}
        });
        /// TODO , refactor duplicate lines
        await newUser.save();
        const currentUser = await User.findOne({googleId:googleId},function(err,User){
            if(err) throw new Error(err);
            return User._id;
        });
        const newSettings = new Settings({
            fromUser:currentUser._id
        });
        await newSettings.save();
        const newProfile = new Profile({
            fromUser:currentUser._id
        });
        await newProfile.save();
        const settings = await Settings.findOne({fromUser:currentUser._id});
        const profile = await Profile.findOne({fromUser:currentUser._id});
        await User.updateOne({_id:currentUser._id},{settings:settings._id,profile:profile._id});
        req.session.email = email;
        req.session._id = currentUser._id;
        req.session.loggedIn = currentUser;
        res.redirect('/dashboard');
    }else {
        res.redirect(google.urlGoogle());
    }
};
/**
 *
 * @param req
 * @param res
 */
exports.logout_get = function getLogout(req,res){
    req.logout();
    res.redirect('/login');
};
