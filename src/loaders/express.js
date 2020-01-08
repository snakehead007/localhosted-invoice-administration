const express = require( 'express');
const bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

module.exports.default =  function( app ){

    console.log("[info]: Start loading express functionalities");
    app.locals.title = 'invoice-administration';
    app.locals.email = 'snakehead007@pm.me';

    app.engine('pug', pug.__express);
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');

    console.log("[info]:    Engine  and view loaded");
    app.use(express.static(path.join(path.resolve(), 'public')));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    console.log("[info]:    bodyParser set up");
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
            saveUninitialized: false,
            resave: false
        })
    );
    console.log("[info]:    Sessions set up");

    app.listen(process.env.PORT,() => {
        console.log('Server is running at PORT ' + process.env.PORT);
    });
};