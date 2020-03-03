const Mailgun = require('mailgun-js');
const fs = require('fs');
const path = require('path');
exports.sendTestMail = (to) => {
    const mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
    const data = {
        //Specify email data
        from: process.env.MAILGUN_FROM,
        //The email to contact
        to: to,
        //Subject and text data
        subject: 'test mail',
        html: 'test'
    };
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            console.log(body);
        }
    });
};

exports.sendWelcome = (to) => {
    const mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
    let _path = path.resolve(__dirname,'../../mails/welcome.html');
    console.log(_path);
    fs.readFile(_path, 'utf8', function(err, text) {
         const data = {
            //Specify email data
            from: process.env.MAILGUN_FROM,
            //The email to contact
            to: to,
            //Subject and text data
            subject: 'Welcome to invoice-administration!',
            html: text.toString()
        };
        mailgun.messages().send(data, function (err, body) {
            //If there is an error, render the error page
            if (err) {
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
};

exports.sendAttachment = (to,attachmentPath,attachmentName) => {
    const mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
    const data = {
        //Specify email data
        from: process.env.MAILGUN_FROM,
        //The email to contact
        to: to,
        //Subject and text data
        subject: 'Your invoice '+attachmentName,
        html: 'You can download your invoice in the attachment',
        attachment:attachmentPath
    };
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            console.log(body);
        }
    });
};
