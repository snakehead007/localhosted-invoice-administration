const express = require( 'express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const fileUpload = require('express-fileupload');
const timeout = require('connect-timeout');
const initialize = require('express-init');
const cookieParser = require('cookie-parser');
const i18n = require("i18n");

module.exports.default =  function( app ){

    app.locals.title = 'invoice-administration';
    app.locals.email = 'snakehead007@pm.me';
    app.engine('pug', pug.__express);
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');
    console.log("[Info]: . . . . Engine and view loaded");
    app.use(cookieParser());
    i18n.configure({
        locales:['en', 'nl'],
        defaultLocale: 'nl',
        directory: path.join(path.resolve(),'/locales')
    });
    app.use(i18n.init);
    console.log("[Info]: . . . . Locales set up");
    app.use(fileUpload);
    app.use(express.static(path.join(path.resolve(), 'public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    console.log("[Info]: . . . . Express settings set up");

    app.use(timeout('5s'));
    app.use(haltOnTimedout);
    function haltOnTimedout(req, res, next){
        if (!req.timedout) next();
    }
    console.log("[Info]: . . . . Timeout settings set up");

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
            saveUninitialized: false,
            resave: false
        })
    );
    console.log("[Info]: . . . . Sessions set up");
    initialize(app, function(err) {
        if (err)
            throw new Error("[Error]: "+err);
        app.listen(process.env.PORT,() => {
            console.log('[Info]: Server is running at PORT ' + process.env.PORT);
        });
    });
};