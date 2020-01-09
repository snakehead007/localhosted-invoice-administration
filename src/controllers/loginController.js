const google = require('../middlewares/google');
exports.login_get =  function getLogin(req,res){
    let sess = req.session;
    if(sess._id){
        return res.redirect('/dashboard');
    }
    res.render('login');
};

exports.create_user_get = function getCreateNewUser(req,res){
    res.redirect(google.urlGoogle());
};

exports.logout_get = function getLogout(req,res){
    req.logout();
    res.redirect('/login');
};
