const session = require('express-session');
const google = require('../middlewares/google');
exports.login_get =  function getLogin(req,res){
    let sess = req.session;
    if(sess.email){
        return res.redirect('/dashboard');
    }
    console.log("control for logging in running...");
    res.render('login');
};

exports.create_user_get = function getCreateNewUser(req,res){
    res.redirect(google.urlGoogle());
};

exports.logout_get = function getLogout(req,res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
};
