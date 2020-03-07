# Invoice-administration

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2b050f3946714359aaca43cc883f5115)](https://www.codacy.com/manual/snakehead007/invoice-administration?utm_source=github.com&utm_medium=referral&utm_content=snakehead007/invoice-administration&utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.com/snakehead007/invoice-administration.svg?branch=master)](https://travis-ci.com/snakehead007/invoice-administration)

This program is mainly used for managing and administrating invoices and generating them into .pdf format
<br> Currently only used for Belgian clients and users.  
<br> Version 3.0.0 (close beta) is out. We are still improving and adding things on a daily basis. 
<br> To contribute, use and/or test it out, contact me. 

This project is translated in 2 languages, Dutch and English.

This program is created and maintained for [www.mdsart.be/](https://www.mdsart.be/)

## demo

If you want to test it out and help make this program better, you can contact me so I can whitelist you.
After that, you'll be able to go to [account.karel.be](https://account.karel.be/) and use it.

## about

Functionalities:

-   Add contacts, invoices, quotations, offers, materials
-   A yearly chart (automatically updated);
-   Downloadable pdfs for Invoices, quotations and offers
-   Upload your logo to use on the pdf's. 
-   A personalized profile
-   All documents have a status, to keep that it has been payed or not.
-   A search function
-   5 different themes
-   Sign in by Google
-   Changeable text for the pdf's
-   2 languages: English and Dutch

### How to Install locally or host

-   local: 
       rename .env.bak to .env 
       <br> and fill in the top most stuff (apis.google.com and mailgun.com info)
      `docker-compose up --build`

-   synology/hub.docker:

     start container [mongo](https://hub.docker.com/_/mongo) first.

     start container [invoice-administration](https://hub.docker.com/repository/docker/snakehead007/invoice-administration) second, with link to mongo container as 'mongo'.

### About (technical)

All data is stored safely on by mongoDB behind a firewall on my server. unless you use a local version.

The front end view is handled by 'pug' and the backend is runned by 'nodejs'.

All the request are run with 'Express'.

The API documentation are hosted on [snakehead007.github.io/invoice-administration](https://snakehead007.github.io/invoice-administration)
  
## Screenshots

![Profile edit page](screenshots/1.png)

![Settings page](screenshots/2.png)

![index page](screenshots/3.png)

![pdf generated invoice ](screenshots/4.png)

![contacts page](screenshots/5.png)

![Invoices and others of 1 contact](screenshots/6.png)

![the chart](screenshots/7.png)

## Future plans

-   In the future the view engine, Pug, will be replace by React.
-   When this project comes out of beta, you'll be able to create an account  for a monthly fee.
