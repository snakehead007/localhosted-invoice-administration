const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pug = require("pug");
const session = require("express-session");
const flash = require("express-flash");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const i18n = require("i18n");
const toobusy = require('toobusy-js');
const hpp = require('hpp');
const logger = require("../middlewares/logger");
const xssFilter = require('x-xss-protection');
const paypal = require('paypal-rest-sdk');
module.exports.default = function (app) {
    app.locals.title = "invoice-administration";
    app.locals.email = "snakehead007@pm.me";
    app.engine("pug", pug.__express);
    app.set("views", path.join(path.resolve(), "views"));
    app.set("view engine", "pug");
    app.use(cookieParser());
    i18n.configure({
        locales: ["en-GB", "nl-BE"],
        defaultLocale: "nl-BE",
        directory: path.join(path.resolve(), "locales"),
        cookie: "session"
    });
    app.use(function (req, res, next) {
        i18n.init(req, res, next);
    });
    app.use(function (req, res, next) {
        res.locals.__ = res.__ = function () {
            return i18n.__.apply(req, arguments);
        };
        next();
    });
    app.use(fileUpload());
    app.use(express.static(path.join(path.resolve(), "public")));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(
        session({
            name: "session",
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: false
        })
    );
    app.use(flash());
    app.use(hpp());

    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });
    app.listen(process.env.PORT);
    if(process.env.DEVELOP==='true'){
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': process.env.PAYPAL_CLIENT_ID_SANDBOX, // please provide your client id here
            'client_secret': process.env.PAYPAL_CLIENT_SECRET_SANBOX // provide your client secret here
        });
    }else{
        paypal.configure({
            'mode': 'live', //sandbox or live
            'client_id': process.env.PAYPAL_CLIENT_ID, // please provide your client id here
            'client_secret': process.env.PAYPAL_CLIENT_SECRET // provide your client secret here
        });
    }
};
