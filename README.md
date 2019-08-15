# simple-invoice-administration
this program is used for managing and administrating invoices and generating them into .pdf format

v1.8: stable

about
--
You can add contacts, invoices and quotations.
Quotations can be upgraded to an invoice.
Both invoices and quotations are available for download.
The ability to edit your own profile for the invoices and quotations are also available.
For invoices there is a switch, to keep that it has been payed or not.
Other functionalities are:
  - yearly chart
  - adding materials (with calculations)
  - calculations (inch to cm, percentage, ...)
  - search function

There are 4 themes: Grey, Dark, White, Blue, Red

### About (technical)
All data is kept locally by mongodb.
(Changing from computer, you will have to export and import all data manually,for now.)

The front end view is handled by 'Jade' and the backend is runned by 'nodejs'.
All the request are run with 'Express'.
For more information about all the packages that are used in this project check the [wiki](https://github.com/snakehead007/simple-invoice-administration/wiki) .

Installation and preparation
--

Check the [wiki](https://github.com/snakehead007/simple-invoice-administration/wiki) for more information.

The default password is "password".

Screenshots
-

![Profile edit page](screenshots/1.png)

![Settings page](screenshots/2.png)

![index page](screenshots/3.png)

![pdf generated invoice ](screenshots/4.png)

![contacts page](screenshots/5.png)

![Invoices and others of 1 contact](screenshots/6.png)

![the chart](screenshots/7.png)
