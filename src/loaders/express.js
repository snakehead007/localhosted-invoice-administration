const express = require( 'express');
const  bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const session = require('express-session');
const passport = require('passport');
require('../middlewares/passport')(passport);
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

    console.log("[info]:    metthodOverrride set up");
    app.use(
        session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true
        })
    );
    console.log("[info]:    Cookies and sessions set up");

    app.use(passport.initialize());
    app.use(passport.session());

    console.log("[info]:    passport methods set up");

    app.listen(process.env.PORT,() => {
        console.log('Server is running at PORT ' + process.env.PORT);
    });
};
