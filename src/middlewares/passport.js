/*
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { getUserByEmail, getUserById, comparePassword, createUser} = require('../models/user.js');
// Load User model
const User = require('../models/user.js');
const {google} = require('googleapis');

module.exports = async function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            getUserByEmail(email, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, req.flash('error_message', 'No email is found'));
                }
                comparePassword(password, user.password, function(err, isMatch) {
                    if (err) { return done(err); }
                    if(isMatch){
                        return done(null, user, req.flash('success_message', 'You have successfully logged in!!'));
                    }
                    else{
                        return done(null, false, req.flash('error_message', 'Incorrect Password'));			}
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        getUserById(id, function(err, user) {
            done(err, user);
        });
    });
};
*/