# simple-invoice-administration
this program is used for managing and administrating invoices and generating them into .pdf format

v1.6: stable

about
--
You can add contacts, invoices and quotations.
Quotations can be upgraded to an invoice.
Both invoices and quotations are available for download.
The ability to edit your own profile for the invoices and quotations are also available.
For invoices there is a switch, to keep that it has been payed or not.

There are 4 themes: Grey, Dark, White, Blue, Red

All data is kept locally by mongodb.
Changing from computer, you will have to export and import all data manually (for now)


preparation
--

##### download and install nodejs:

[Windows/MacOs](https://nodejs.org/en/download/)

[Linux](https://nodejs.org/en/download/package-manager/)



##### install these npm packages

```
  npm install express jade mongodb mongoose forever forever-monitor chartjs --save
```

#### each package does:


##### express:

handles the application’s endpoints (URIs) to respond to its client request

##### jade:

A terse language for writing HTML, supports dynamic sites

##### mongodb:

A noSQL database, saves all the data from the user

##### mongoose:

A straight-forward, schema-based solution to model the application data, communicates with mongodb

##### forever, forever-monitor:

CLI tool for ensuring that a given script runs continuously

##### chartjs
Simple and flexible JavaScript charting

start the server by:
--

starting the database
```
  mongod
```

starting node
```
  node start
```

Screenshots
-

![index page](screenshots/1.png)

![profile edit page](screenshots/3.png)

![invoices of 1 person](screenshots/4.png)

![pdf generated invoice](screenshots/5.png)

![All invoices](screenshots/6.png)

![all contacts](screenshots/7.png)
