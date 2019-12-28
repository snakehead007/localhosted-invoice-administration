const express = require( 'express');
const  bodyParser = require('body-parser');
const path = require('path');
const pug = require('pug');
const dotenv = require('./dotenv.js');

module.exports.default =  function( app ){
    try {
        app.locals.title = 'invoice-administration';
        app.locals.email = 'snakehead007@pm.me';
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.engine('pug', pug.__express);
    }catch(ex){
        console.log("error:  "+ex.message+"\n"+ex);
    }
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(path.resolve(), 'public')));
    app.listen(dotenv.PORT,() => {
        console.log('Server is running at PORT ' + dotenv.PORT);
    });
};
