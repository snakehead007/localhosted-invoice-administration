define({ "api": [
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/",
    "title": "getActivity",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "describes",
            "description": "<p>idc here</p>"
          }
        ]
      }
    },
    "description": "<p>shows a list of all the activities of the user</p>",
    "name": "getActivity",
    "group": "ActivityRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n  \"settings\":settings,\n   \"role\":role,\n   \"profile\":profile,\n   \"currentUrl\":\"activities\",\n   \"activities\":activities\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/activityController.js",
    "groupTitle": "ActivityRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/undo/:id",
    "title": "getUndoActivity",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>of the object that has been removed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"ido\": order._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>Undo the removal of an object by setting the isRemove of the object and subdocuments to false</p>",
    "name": "getUndoActivity",
    "group": "ActivityRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    redirect to /activity",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/activityController.js",
    "groupTitle": "ActivityRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/remove/:id",
    "title": "removeGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>of the object to be removed</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"ido\": order._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>sets the object and its subdocuments property isRemoved to true</p>",
    "name": "removeGet",
    "group": "ActivityRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   redirect to /activity",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/activityController.js",
    "groupTitle": "ActivityRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/client/all",
    "title": "getClientAll",
    "description": "<p>Shows all clients of the user</p>",
    "name": "getClientAll",
    "group": "ClientRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n res.render(\"clients\", {\n    \"clients\": clients,\n    \"settings\": settings,\n    \"profile\": profile,\n    \"currentUrl\": \"clientAll\",\n    \"role\": role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/clientController.js",
    "groupTitle": "ClientRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/client/new",
    "title": "getClientNew",
    "description": "<p>Shows a form where the user can create a new user</p>",
    "name": "getClientNew",
    "group": "ClientRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n res.render(\"new/new-client\", {\n    \"settings\": settings,\n    \"profile\": profile,\n    \"currentUrl\": \"clientNew\",\n    \"role\": role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/clientController.js",
    "groupTitle": "ClientRouter"
  },
  {
    "version": "3.0.0",
    "type": "post",
    "url": "/client/new",
    "title": "postClientNew",
    "description": "<p>creates a new client all parameters given in the form are checked using the formValidator.js</p>",
    "name": "postClientNew",
    "group": "ClientRouter",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "Creates",
            "description": "<p>a new client for the logged in user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/client/all\");",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ClientError",
            "description": "<p>Does not create a new client it redirects you back to /client/new</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-response:",
          "content": "res.render(\"edit/edit-client\", {\n    \"settings\": settings,\n    \"profile\": profile,\n    \"currentUrl\": \"clientNew\",\n    \"client\": {\n        \"clientName\": req.body.clientName,\n        \"firm\": req.body.firm,\n        \"street\": req.body.street,\n        \"streetNr\": req.body.streetNr,\n        \"vat\": req.body.vat,\n        \"bankNr\": req.body.bankNr,\n        \"postalCode\": req.body.postalCode,\n        \"place\": req.body.place,\n        \"vatPercentage\": req.body.vatPercentage\n    },\n    \"role\": role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/clientController.js",
    "groupTitle": "ClientRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/chart/:year",
    "title": "chartYearGet",
    "description": "<p>This gives back the dashboard but with a different year, with the parameter :year as a number</p>",
    "name": "chartYearGet",
    "group": "DashboardRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       \"currentUrl\": \"dashboard\",\n       \"total\": newChart,\n       \"settings\": settings,\n       \"year\": req.params.year,\n       \"profile\": profile,\n       \"invoices\": invoice_open,\n       \"role\": role\n   }",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"year\": 2019\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/dashboardController.js",
    "groupTitle": "DashboardRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/",
    "title": "mainGet",
    "description": "<p>This gives back the dashboard</p>",
    "name": "mainGet",
    "group": "DashboardRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{{\n       \"currentUrl\": \"dashboard\",\n       \"total\": newChart,\n       \"settings\": settings,\n       \"year\": (new Date).getFullYear(),\n       \"profile\": profile,\n       \"invoices\": invoice_open,\n       \"role\": role\n   }",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/dashboardController.js",
    "groupTitle": "DashboardRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/delete/client/:idc",
    "title": "deleteClient",
    "description": "<p>Deletes the client and redirects to /clients/all</p>",
    "name": "deleteClient",
    "group": "DeleteRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idc\": client._id\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "DeleteRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/delete/logo",
    "title": "deleteLogoGet",
    "description": "<p>Deletes the logo of the profile of the user in session and redirects to /clients/all</p>",
    "name": "deleteClient",
    "group": "DeleteRouter",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "On",
            "description": "<p>error redirects to /view/profile and flashes error: &quot;Error, something went wrong&quot; or &quot;There is no logo to delete&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "DeleteRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/delete/invoice/:idi",
    "title": "deleteInvoiceGet",
    "description": "<p>Deletes the invoice and redirects to /invoices/all</p>",
    "name": "deleteInvoiceGet",
    "group": "DeleteRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "DeleteRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/delete/order/:ido",
    "title": "deleteClient",
    "description": "<p>Deletes the order of an invoice and redirects to /order/all</p>",
    "name": "deleteOrderGet",
    "group": "DeleteRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"ido\": order._id\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "DeleteRouter"
  },
  {
    "type": "get",
    "url": "/download/credit/:idi",
    "title": "downloadCreditPDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadCreditPDF",
    "group": "DownloadRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "DownloadRouter"
  },
  {
    "type": "get",
    "url": "/download/invoice/:idi",
    "title": "downloadInvoicePDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadInvoicePDF",
    "group": "DownloadRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "DownloadRouter"
  },
  {
    "type": "get",
    "url": "/download/offer/:idi",
    "title": "downloadOfferPDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadOfferPDF",
    "group": "DownloadRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "DownloadRouter"
  },
  {
    "type": "get",
    "url": "/edit/profile",
    "title": "edit_profile_get",
    "name": "edit_profile_get",
    "description": "<p>this will redirect to view_profile_get</p>",
    "group": "EditRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "EditRouter"
  },
  {
    "type": "post",
    "url": "/edit/profile",
    "title": "edit_profile_post",
    "name": "edit_profile_post",
    "description": "<p>The profile will be updated with all its given parameters in the form Afterwards will be redirected to /view/profile</p>",
    "group": "Edit",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "Edit"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/order/all/:idi",
    "title": "allOrderGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idi",
            "description": "<p>unique id of the invoice where we want to see all the orders from</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"idi\": invoice._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>Shows a form of the invoice where the user can edit the invoice, and shows all orders of that invoice in a table</p>",
    "name": "allOrderGet",
    "group": "OrderRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " res.render(\"orders\", {\n    \"invoice\": invoice,\n    \"orders\": orders,\n    \"profile\": profile,\n    \"client\": client,\n    \"settings\": settings,\n    \"role\": role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "OrderRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/order/edit/:ido",
    "title": "editOrderGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ido",
            "description": "<p>unique id the order</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"ido\": order._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>shows a form where the user can edit an existing order</p>",
    "name": "editOrderGet",
    "group": "OrderRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.render(\"edit/edit-order\", {\n           \"order\": order,\n           \"invoice\": invoice,\n           \"profile\": profile,\n           \"settings\": settings,\n           \"role\": role\n       });",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "OrderRouter"
  },
  {
    "version": "3.0.0",
    "type": "post",
    "url": "/order/edit/:ido",
    "title": "editOrderPost",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ido",
            "description": "<p>unique id of the order where we want to see the order from</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"ido\": order._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>Updates an exisiting order with new information</p>",
    "name": "editOrderPost",
    "group": "OrderRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/order/all/\" + invoice._id);",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "OrderRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/order/new/:idi",
    "title": "newOrderGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idi",
            "description": "<p>unique id of the invoice where the order should be added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"idi\": invoice._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>show a form where you can add an order that will be added to a certain invoice</p>",
    "name": "newOrderGet",
    "group": "OrderRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.render(\"new/new-order\", {\n       \"invoice\": invoice,\n       \"profile\": profile,\n       \"settings\": settings,\n       \"client\": client,\n       \"currentUrl\": \"orderNew\",\n       \"role\": role\n   });",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "OrderRouter"
  },
  {
    "version": "3.0.0",
    "type": "post",
    "url": "/order/new/:idi",
    "title": "newOrderPost",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idi",
            "description": "<p>unique id of the invoice where the order should be added to</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"idi\": invoice._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>Adds an order to the given unique invoice</p>",
    "name": "newOrderPost",
    "group": "OrderRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/order/all/\" + req.params.idi);",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "OrderRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/redirect/",
    "title": "googleLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "description": "<p>unique id the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"id\": client._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>this will use the {@link src/middlewares/google|Google middleware} to decrypt to OAuth2 login information of the user</p>",
    "name": "getClientAll",
    "group": "RedirectRouter",
    "filename": "src/controllers/redirectController.js",
    "groupTitle": "RedirectRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/redirect/",
    "title": "redirectGoogleLogin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "description": "<p>unique id the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"id\": client._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>Shows all clients of the user</p>",
    "name": "redirectGoogleLogin",
    "group": "Redirect",
    "success": {
      "examples": [
        {
          "title": "Success-Example when not in the whitelist:",
          "content": "req.flash('warning', 'You are not whitelisted, please contact the administrator');\nres.redirect('/');",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/redirectRouter.js",
    "groupTitle": "Redirect"
  },
  {
    "version": "3.0.0",
    "type": "post",
    "url": "/search",
    "title": "searchGet",
    "description": "<p>Searches the string if it contains in Clients, Invoices and orders</p>",
    "name": "searchGet",
    "group": "SearchRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " res.render('search', {\n    \"description\": i18n.__(\"search on \") + \"\\\"\" + str + \"\\\"\",\n    \"settings\": settings,\n    \"clients\": clients_d,\n    \"orders\": orders_d,\n    \"invoices\": invoices_d,\n    \"items\": items_d,\n    \"profile\": profile,\n    \"currentSearch\": str,\n    \"role\":role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/searchController.js",
    "groupTitle": "SearchRouter"
  },
  {
    "type": "get",
    "url": "/settings/change/text",
    "title": "changeTextGet",
    "name": "changeTextGet",
    "description": "<p>Updates the settings invoiceText, creditText and offerText of the current user aftwards redirects to /settings</p>",
    "group": "SettingsRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/settings\");",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "SettingsRouter"
  },
  {
    "type": "get",
    "url": "/settings",
    "title": "settingsAllGet",
    "name": "settingsAllGet",
    "description": "<p>Renders the main settings view where the user can edit there theme, footnotes and vat</p>",
    "group": "SettingsRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.render(\"settings\", {\n               \"currentUrl\": \"settings\",\n               \"settings\": settings,\n               \"description\": \"Settings\",\n               \"profile\": profile,\n               \"role\": role\n           });",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "SettingsRouter"
  },
  {
    "type": "get",
    "url": "/settings/change/lang/:lang",
    "title": "settingsChangeLangGet",
    "name": "settingsChangeLangGet",
    "description": "<p>Changes the settings locale to the chosen language Also changes the locals and locale session to the chosen language Afterwards redirects to /settings</p>",
    "group": "SettingsRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/settings\");",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "SettingsRouter"
  },
  {
    "type": "get",
    "url": "/settings/change/theme/:theme",
    "title": "settingsChangeThemeGet",
    "name": "settingsChangeThemeGet",
    "description": "<p>Updates the theme in the settings of the current user afterwards redirects to /settings</p>",
    "group": "SettingsRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/settings\")",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "SettingsRouter"
  },
  {
    "type": "get",
    "url": "/stream/credit/:idi",
    "title": "streamCreditPDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamCreditPDF",
    "group": "StreamRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "StreamRouter"
  },
  {
    "type": "get",
    "url": "/stream/invoice/:idi",
    "title": "streamInvoicePDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamInvoicePDF",
    "group": "StreamRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "StreamRouter"
  },
  {
    "type": "get",
    "url": "/stream/offer/:idi",
    "title": "streamOfferPDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamOfferPDF",
    "group": "StreamRouter",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idi\": invoice._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/downloadController.js",
    "groupTitle": "StreamRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/upload/logo",
    "title": "uploadLogoGet",
    "description": "<p>Shows a form where you can upload a logo (only .jpeg or .jpg) file onto your profile</p>",
    "name": "uploadLogoGet",
    "group": "UploadRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    res.render(\"upload\", {\n       \"settings\": settings,\n       \"description\": \"Upload logo\",\n       \"profile\": profile,\n       \"role\": role\n   })",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/uploadController.js",
    "groupTitle": "UploadRouter"
  },
  {
    "version": "3.0.0",
    "type": "post",
    "url": "/upload/logo",
    "title": "uploadLogoPost",
    "description": "<p>uploads the logo as binary onto the profile model in the database</p>",
    "name": "uploadLogoPost",
    "group": "UploadRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.redirect(\"/view/profile/\");",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "res.redirect(\"/upload/logo\");",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/uploadController.js",
    "groupTitle": "UploadRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/client/view/:idc",
    "title": "getClientView",
    "description": "<p>Shows all the information of the clients id from query parameter &quot;idc&quot;</p>",
    "name": "getClientView",
    "group": "ViewRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"client\": client,\n       \"profile\": profile,\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/clientController.js",
    "groupTitle": "ViewRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/view/order/:ido",
    "title": "viewOrderGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ido",
            "description": "<p>unique id of the order where we want to see the order from</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"ido\": order._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>shows a table of the information of a specific order</p>",
    "name": "viewOrderGet",
    "group": "ViewRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " res.render(\"view/view-order\",{\n    \"order\": order,\n    \"invoice\": invoice,\n    \"profile\": profile,\n    \"settings\": settings,\n    \"role\": role\n});",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/orderController.js",
    "groupTitle": "ViewRouter"
  },
  {
    "type": "get",
    "url": "/view/profile",
    "title": "viewProfileGet",
    "description": "<p>On this page you can edit all the profile information and shows the current logo picture</p>",
    "name": "viewProfileGet",
    "group": "ViewRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"currentUrl\":\"edit-profile\",\n       \"profile\": profile,\n       \"offerNrCurrent\": Number(jaar + nroff_str),\n       \"invoiceNrCurrent\": Number(jaar + nr_str),\n       \"creditNrCurrent\": Number(jaar + nrcred_str),\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "ViewRouter"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/view/invoice/:idi",
    "title": "viewInvoiceGet",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "idi",
            "description": "<p>unique id of the invoice where we want to see the invoice from</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "title:",
          "content": "\"idi\": invoice._id",
          "type": "String"
        }
      ]
    },
    "description": "<p>shows a table of the information of a specific invoice</p>",
    "name": "viewInvoiceGet",
    "group": "View",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "res.render(\"view/view-invoice\", {\n       \"invoice\": invoice,\n       \"client\": client,\n       \"description\": i18n.__(description) + \" \" + (client.firm)?client.firm:client.clientName,\n       \"settings\": settings,\n       \"currentUrl\": \"creditView\",\n       \"profile\": profile,\n       \"role\": role\n   })",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/invoiceController.js",
    "groupTitle": "View"
  },
  {
    "version": "3.0.0",
    "type": "get",
    "url": "/whitelist/:secret/:mail",
    "title": "addToWhitelist",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "secret",
            "description": "<p>unique secret string</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mail",
            "description": "<p>email to whitelist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "mail:",
          "content": "\"mail\": test@test.test",
          "type": "String"
        }
      ]
    },
    "description": "<p>Adds an email to the whitelist list on the server</p>",
    "name": "addToWhitelist",
    "group": "WhitelistRouter",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n   \"success\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Failed-Response:",
          "content": "HTTP/1.1 200 OK\n  \"failed\"",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n   \"error\"",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/whitelistController.js",
    "groupTitle": "WhitelistRouter"
  }
] });
