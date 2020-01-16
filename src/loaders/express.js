const express = require( 'express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const redis = require('redis');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const i18n = require("i18n");
module.exports.default = function(app){
    app.locals.title = 'invoice-administration';
    app.locals.email = 'snakehead007@pm.me';
    app.engine('pug', pug.__express);
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');
    console.log("[Info]: . . . . Engine and view loaded");
    app.use(cookieParser());
    i18n.configure({
        locales:['en-GB', 'nl-BE'],
        defaultLocale: 'nl-BE',
        directory: path.join(path.resolve(),'locales'),
        cookie:'session'
    });
    app.use(function(req,res,next){
        i18n.init(req,res,next);
    });
    app.use(function(req, res, next) {
        res.locals.__ = res.__ = function() {
            return i18n.__.apply(req, arguments);
        };
        next();
    });
    console.log("[Info]: . . . . Locales set up");
    app.use(fileUpload());
    app.use(express.static(path.join(path.resolve(), 'public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    console.log("[Info]: . . . . Express settings set up");
    app.use(
        session({
            name: 'session',
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: false
        })
    );
    console.log("[Info]: . . . . Sessions set up");
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
    });

    app.listen(process.env.PORT,() => {
        console.log('[Info]: Server is running at PORT ' + process.env.PORT);
    });
};
