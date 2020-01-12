const google = require('../middlewares/google');
const User = require('../models/user');
const Settings = require('../models/settings');
const Profile = require('../models/profile');

exports.login_get =  function getLogin(req,res){
    req.session;
    /*if(req.session&&req.session._id){
        return res.redirect('/dashboard');
    }*/
    res.render('login');
};

exports.create_user_get = async function getCreateNewUser(req,res){
    if(process.env.DEVELOP==="true"){
        const googleId = Math.floor((Math.random() * 99999999999999999999999999999999999) + 10000000000000000000000000000000000);
        const email = "test@development.this";
        const tokens = {};
        const newUser = new User({
            googleId: googleId,
            email: "test@development.this",
            tokens:{}
        });
        await newUser.save();
        const currentUserId = await User.findOne({googleId:googleId},function(err,User){
            if(err) throw new Error(err);
            return User._id;
        });
        const newSettings = new Settings({
            fromUser:currentUserId
        });
        await newSettings.save();
        const newProfile = new Profile({
            fromUser:currentUserId
        });
        await newProfile.save();
        const settings = await Settings.findOne({fromUser:currentUserId});
        const profile = await Profile.findOne({fromUser:currentUserId});
        await User.updateOne({_id:currentUserId},{settings:settings._id,profile:profile._id});
        req.session.email = email;
        req.session._id = currentUserId;
        res.redirect('/dashboard');
    }else {
        res.redirect(google.urlGoogle());
    }
};

exports.logout_get = function getLogout(req,res){
    req.logout();
    res.redirect('/login');
};
