const express = require( 'express');
const  bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const dotenv = require('./dotenv.js');
const helmet = require("helmet");
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pkg = require('../../package.json');
const mongoStore = require('connect-mongo');
const helpers = require('view-helpers');
const csrf = require('csurf');

module.exports.default =  function( app, passport ){
    console.log("[info]: Start loading express functionalities");
    app.locals.title = 'invoice-administration';
    app.locals.email = 'snakehead007@pm.me';
    app.use(helmet());
    app.use(
        compression({
            threshold: 512
        })
    );
    app.engine('pug', pug.__express);
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');
    console.log("[info]:    Engine  and view loaded");
    app.use(express.static(path.join(path.resolve(), 'public')));
    app.use(function(req, res, next) {
        res.locals.pkg = pkg;
        res.locals.env = env;
        next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(
        methodOverride(function(req) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                const method = req.body._method;
                delete req.body._method;
                return method;
            }
        })
    );
    console.log("[info]:    metthodOverrride set up");
    app.use(cookieParser());
    mongoStore(session);
    console.log("------------");
    console.log(pkg.name);
    console.log(dotenv.URI);
    console.log("-------------");
    app.use(
        session({
            secret: pkg.name,
            proxy: true,
            resave: true,
            saveUninitialized: true,
            store: new mongoStore({
                url: dotenv.URI,
                collection: 'sessions'
            })
        })
    );
    console.log("[info]:    Cookies and sessions set up");

    app.use(passport.initialize());
    app.use(passport.session());

    console.log("[info]:    passport methods set up");
    app.use(helpers(pkg.name));

    app.use(csrf());

    // This could be moved to view-helpers :-)
    app.use(function(req, res, next) {
        res.locals.csrf_token = req.csrfToken();
        next();
    });
    console.log("[info]:    csrf set up");
    app.listen(dotenv.PORT,() => {
        console.log('Server is running at PORT ' + dotenv.PORT);
    });
};
