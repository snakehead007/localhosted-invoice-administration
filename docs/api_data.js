define({ "api": [
  {
    "type": "get",
    "url": "/calc/all",
    "title": "getCalcAll",
    "description": "<p>Here you can view all the calculations and navigate to the specific one.</p>",
    "name": "getCalcAll",
    "group": "Calc",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    'currentUrl':'calc',\n       'settings': settings,\n       'description': \"Settings\",\n       'profile':profile\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/calcController.js",
    "groupTitle": "Calc"
  },
  {
    "type": "get",
    "url": "/client/all",
    "title": "getClientAll",
    "description": "<p>Here you can view all the clients from the current user</p>",
    "name": "getClientAll",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"clients\": clients,\n       \"settings\": settings,\n       \"profile\":profile,\n       \"currentUrl\":\"clientAll\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client/new",
    "title": "getClientNew",
    "description": "<p>Shows a form that creates a new client</p>",
    "name": "getClientNew",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"settings\": settings,\n       \"profile\":profile,\n       \"currentUrl\":\"clientNew\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client/view/:idc",
    "title": "getClientView",
    "description": "<p>Shows all the information of the clients id from query parameter &quot;idc&quot;</p>",
    "name": "getClientView",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"client\": client,\n       \"profile\": profile,\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/client/new",
    "title": "postClientNew",
    "description": "<p>creates a new client for the specific user, renders /client/all</p>",
    "name": "postClientNew",
    "group": "Client",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"client\": client,\n       \"profile\": profile,\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/clientController.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/chart/:year",
    "title": "chartYearGet",
    "description": "<p>This gives back the dashboard but with a different year, with the parameter :year as a number</p>",
    "name": "chartYearGet",
    "group": "Dashboard",
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
    "version": "0.0.0",
    "filename": "src/controllers/dashboardController.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "get",
    "url": "/",
    "title": "mainGet",
    "description": "<p>This gives back the dashboard</p>",
    "name": "mainGet",
    "group": "Dashboard",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{{\n       \"currentUrl\": \"dashboard\",\n       \"total\": newChart,\n       \"settings\": settings,\n       \"year\": (new Date).getFullYear(),\n       \"profile\": profile,\n       \"invoices\": invoice_open,\n       \"role\": role\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/dashboardController.js",
    "groupTitle": "Dashboard"
  },
  {
    "type": "get",
    "url": "/delete/client/:idc",
    "title": "deleteClient",
    "description": "<p>Deletes the client and redirects to /clients/all</p>",
    "name": "deleteClient",
    "group": "Delete",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"idc\": client._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "Delete"
  },
  {
    "type": "get",
    "url": "/delete/logo",
    "title": "deleteLogoGet",
    "description": "<p>Deletes the logo of the profile of the user in session and redirects to /clients/all</p>",
    "name": "deleteClient",
    "group": "Delete",
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
    "version": "0.0.0",
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "Delete"
  },
  {
    "type": "get",
    "url": "/delete/invoice/:idi",
    "title": "deleteInvoiceGet",
    "description": "<p>Deletes the invoice and redirects to /invoices/all</p>",
    "name": "deleteInvoiceGet",
    "group": "Delete",
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
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "Delete"
  },
  {
    "type": "get",
    "url": "/delete/order/:ido",
    "title": "deleteClient",
    "description": "<p>Deletes the order of an invoice and redirects to /order/all</p>",
    "name": "deleteOrderGet",
    "group": "Delete",
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"ido\": order._id\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/deleteController.js",
    "groupTitle": "Delete"
  },
  {
    "type": "get",
    "url": "/download/credit/:idi",
    "title": "downloadCreditPDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadCreditPDF",
    "group": "Download",
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
    "groupTitle": "Download"
  },
  {
    "type": "get",
    "url": "/download/invoice/:idi",
    "title": "downloadInvoicePDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadInvoicePDF",
    "group": "Download",
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
    "groupTitle": "Download"
  },
  {
    "type": "get",
    "url": "/download/offer/:idi",
    "title": "downloadOfferPDF",
    "description": "<p>Prompts a download of the pdf inline on the users browser</p>",
    "name": "downloadOfferPDF",
    "group": "Download",
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
    "groupTitle": "Download"
  },
  {
    "type": "get",
    "url": "/edit/profile",
    "title": "edit_profile_get",
    "name": "edit_profile_get",
    "description": "<p>this will redirect to view_profile_get</p>",
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
    "type": "get",
    "url": "/settings/change/text",
    "title": "change_text_post",
    "name": "change_text_post",
    "description": "<p>Updates the settings invoiceText, creditText and offerText of the current user aftwards redirects to /settings</p>",
    "group": "Settings",
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
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings",
    "title": "settings_all_get",
    "name": "settings_all_get",
    "description": "<p>Renders the main settings view where the user can edit there theme, footnotes and vat</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       \"currentUrl\": \"settings\",\n       \"settings\": settings,\n       \"description\": \"Settings\",\n       \"profile\":profile\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings/change/lang/:lang",
    "title": "settings_change_lang_Get",
    "name": "settings_change_lang_get",
    "description": "<p>Changes the settings locale to the chosen language Also changes the locals and locale session to the chosen language Afterwards redirects to /settings</p>",
    "group": "Settings",
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
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/settings/change/theme/:theme",
    "title": "settings_change_theme_get",
    "name": "settings_change_theme_get",
    "description": "<p>Updates the theme in the settings of the current user afterwards redirects to /settings</p>",
    "group": "Settings",
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
    "filename": "src/controllers/settingsController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/all",
    "title": "stock_all_get",
    "name": "stock_all_get",
    "description": "<p>Renders the stock with all Items sorted by name</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       \"currentUrl\":\"stock\",\n       \"stock\": stock,\n       \"settings\": settings,\n       \"profile\":profile\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/new/item",
    "title": "stock_new_item_get",
    "name": "stock_new_item_get",
    "description": "<p>renders new/new-item, here the user can create a new item</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       \"settings\": settings,\n       \"profile\": profile,\n       \"currentUrl\":\"stockNew\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stock/new/item",
    "title": "stock_new_item_get",
    "name": "stock_new_item_get",
    "description": "<p>renders new/new-item, here the user can create a new item</p>",
    "group": "Settings",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n       \"settings\": settings,\n       \"profile\": profile,\n       \"currentUrl\":\"stockNew\"\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/stockController.js",
    "groupTitle": "Settings"
  },
  {
    "type": "get",
    "url": "/stream/credit/:idi",
    "title": "streamCreditPDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamCreditPDF",
    "group": "Stream",
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
    "groupTitle": "Stream"
  },
  {
    "type": "get",
    "url": "/stream/invoice/:idi",
    "title": "streamInvoicePDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamInvoicePDF",
    "group": "Stream",
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
    "groupTitle": "Stream"
  },
  {
    "type": "get",
    "url": "/stream/offer/:idi",
    "title": "streamOfferPDF",
    "description": "<p>Streams the pdf inline on the users browser</p>",
    "name": "streamOfferPDF",
    "group": "Stream",
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
    "groupTitle": "Stream"
  },
  {
    "type": "get",
    "url": "/view/profile",
    "title": "view_profile_get",
    "description": "<p>On this page you can edit all the profile information and shows the current logo picture</p>",
    "name": "view_profile_get",
    "group": "View",
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
    "groupTitle": "View"
  }
] });
