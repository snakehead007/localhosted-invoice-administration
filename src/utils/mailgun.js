const Mailgun = require('mailgun-js');
const fs = require('fs');
const path = require('path');
exports.sendTestMail = (req,res,next) => {
    const mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
    const data = {
        //Specify email data
        from: process.env.MAILGUN_FROM,
        //The email to contact
        to: "snakehead007@pm.me",
        //Subject and text data
        subject: 'test mail',
        html: 'test'
    };
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            console.log(body);
        }
    });
    next();
};

exports.sendWelcome = (req,res,next) => {
    const mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
    let _path = path.resolve(__dirname,'../../mails/welcome.html');
    console.log(_path);
    fs.readFile(_path, 'utf8', function(err, text) {
         const data = {
            //Specify email data
            from: process.env.MAILGUN_FROM,
            //The email to contact
            to: req.params.mail,
            //Subject and text data
            subject: 'Welcome to invoice-administration!',
            html: text.toString()
        };
        mailgun.messages().send(data, function (err, body) {
            //If there is an error, render the error page
            if (err) {
                res.render('error', { error : err});
                console.log("got an error: ", err);
            }
            //Else we can greet    and leave
            else {
                //Here "submitted.jade" is the view file for this landing page
                //We pass the variable "email" from the url parameter in an object rendered by Jade
                console.log(body);
            }
        });
    });
    next();
};

function readModuleFile(path, callback) {
    try {
        let filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}