import express from 'express';
import  bodyParser from 'body-parser';
import path from 'path';
import pug from 'pug'

export default ( app ) => {
    try {
        app.locals.title = 'invoice-administration';
        app.locals.email = 'snakehead007@pm.me';
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        /*app.use((req, res) => {
            res.status(404).send('404: Page not Found');
        });
        app.use((error, req, res, next) => {
            res.status(500).send('500: Internal Server Error');
        });*/
        app.engine('pug', pug.__express);
    }catch(ex){
        console.log("error:  "+ex.message+"\n"+ex);
    }
    app.set('views', path.join(path.resolve(), 'views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(path.resolve(), 'public')));
};
