exports.login_get =  function getLogin(req,res){
    console.log("control for logging in running...");
    res.render('login');
};

exports.login_post =  function postLogin(req,res){
    console.log("post login");
    res.send("login post");
};

exports.create_user_get = function getCreateNewUser(req,res){
    console.log("create user view");
  res.render("createUser");
};