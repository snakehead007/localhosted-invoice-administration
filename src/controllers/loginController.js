const google = require('../middlewares/google');
exports.login_get =  function getLogin(req,res,err){
    if(err) console.log("[ERROR]: "+err);
    console.log("test");
    let sess = req.session;
    if(sess._id){
        return res.redirect('/dashboard');
    }
    res.render('login');
};

exports.create_user_get = function getCreateNewUser(req,res,err){
    if(err) console.log("[ERROR]: "+err);
    res.redirect(google.urlGoogle());
};

exports.logout_get = function getLogout(req,res,err){
    if(err) console.log("[ERROR]: "+err);
    req.logout();
    res.redirect('/login');
};
