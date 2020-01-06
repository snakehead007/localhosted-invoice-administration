const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user.js');

exports.login_get =  function getLogin(req,res){
    console.log("control for logging in running...");
    res.render('login');
};

exports.login_post =  function postLogin(req,res,next){
    console.log("post login");
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res,next);
};

exports.create_user_get = function getCreateNewUser(req,res){
    console.log("create user view");
  res.render("createUser");
};

exports.logout_get = function getLogout(req,res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
};

exports.create_user_post = function postCreateNewUser(req,res){
    console.log("registering new user");
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        console.log("passwords do not match");
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        console.log("password is not long enough");
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        console.log("errors");
        res.render('createUser', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({email:email},function(err,user){
            if (user) {
                console.log("email already exists");
                errors.push({ msg: 'Email already exists' });
                res.render('createUser', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                console.log("[info]: hashing password ...");
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                console.log("[info]: password hashed and saved");
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
};