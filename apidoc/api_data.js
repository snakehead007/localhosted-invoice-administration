define({ "api": [
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
          "content": "HTTP/1.1 200 OK\n{\n       'currentUrl': 'settings',\n       'settings': settings,\n       'description': \"Settings\",\n       'profile':profile\n   }",
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
    "url": "/view/profile",
    "title": "view_profile_get",
    "description": "<p>On this page you can edit all the profile information and shows the current logo picture</p>",
    "name": "view_profile_get",
    "group": "View",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    'currentUrl':\"edit-profile\",\n       'profile': profile,\n       'offerNrCurrent': Number(jaar + nroff_str),\n       'invoiceNrCurrent': Number(jaar + nr_str),\n       'creditNrCurrent': Number(jaar + nrcred_str),\n       \"settings\": settings\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/controllers/profileController.js",
    "groupTitle": "View"
  }
] });
