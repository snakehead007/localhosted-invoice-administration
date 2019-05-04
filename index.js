//- V1.6
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/sample-website');
mongoose.connection.on('open', function() {
  console.log('Mongoose connected.');
});
var maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
Schema = mongoose.Schema;

var SettingsSchema = new Schema({
  thema: {
    type: String,
    default: "secondary"
  },
  oppo: {
    type: String,
    default: "light"
  },
  nav: {
    type: String,
    default: "dark"
  }
});

var Settings = mongoose.model('Settings', SettingsSchema);

var ProfileSchema = new Schema({
  firma: {
    type: String
  },
  naam: {
    type: String
  },
  straat: {
    type: String
  },
  straatNr: {
    type: String
  },
  postcode: {
    type: String
  },
  plaats: {
    type: String
  },
  btwNr: {
    type: String
  },
  iban: {
    type: String
  },
  bic: {
    type: String
  },
  nr: {
    type: Number,
    default: 1
  },
  nroff: {
    type: Number,
    default: 1
  },
  tele: {
    type: String
  },
  mail: {
    type: String
  }
});

var Profile = mongoose.model('Profile', ProfileSchema);

var BestellingSchema = new Schema({
  beschrijving: {
    type: String
  },
  aantal: {
    type: Number
  },
  bedrag: {
    type: Number
  },
  factuur: {
    type: Schema.Types.ObjectId,
    ref: 'Factuur'
  },
  totaal: {
    type: Number
  }
})

var Bestelling = mongoose.model('Bestelling', BestellingSchema);

var FactuurSchema = new Schema({
  datum: {
    type: String
  },
  factuurNr: {
    type: Number
  },
  offerteNr: {
    type: Number
  },
  aantalBestellingen: {
    type: Number,
    default: 0
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  },
  bestellingen: [{
    type: Schema.Types.ObjectId,
    ref: 'Bestelling'
  }],
  isBetaald: {
    type: Boolean,
    default: false
  },
  voorschot: {
    type: Number,
    default: 0
  },
  contactPersoon: {
    type: String,
    default: "Update deze factuur!"
  },
  totaal: {
    type:Number,
    default: 0
  }
})

var Factuur = mongoose.model('Factuur', FactuurSchema);

var ContactSchema = new Schema({
  firma: {
    type: String
  },
  contactPersoon: {
    type: String
  },
  straat: {
    type: String
  },
  straatNr: {
    type: String
  },
  postcode: {
    type: String
  },
  plaats: {
    type: String
  },
  btwNr: {
    type: String
  },
  facturen: [{
    type: Schema.Types.ObjectId,
    ref: 'Factuur'
  }],
  aantalFacturen: {
    type: Number,
    default: 0
  }
});

var Contact = mongoose.model('Contact', ContactSchema);

app.get('/', function(req, res) {
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
      res.redirect('/');
    }
    res.render('index', {
      "description": "MDSART factuurbeheer",
      "settings": settings[0]
    });
  });
});

app.get('/contacten', function(req, res) {
  Contact.find({}, function(err, docs) {
    Settings.find({}, function(err, settings) {
      if (!err && settings.length != 0) {
      } else {
        legeSettings = new Settings();
        legeSettings.save(function(err) {
          if (err) {
            console.log("err in settings: " + err);
          }
        });
      }
      res.render('contacten', {
        'contactenLijst': docs,
        'description': "Contactpersonen",
        "settings": settings[0]
      });
    });
  });
});

app.get('/add-contact', function(req, res) {
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
    }
    res.render('add-contact', {
      'description': "Contact toevoegen",
      "settings": settings[0]
    });
  });
});

app.post('/add-contact', function(req, res) {
  if (
    req.body.contactPersoon &&
    req.body.straat &&
    req.body.plaats) {
    var newContact = new Contact({
      firma: req.body.firma,
      contactPersoon: req.body.contactPersoon,
      straat: req.body.straat,
      straatNr: req.body.straatNr,
      postcode: req.body.postcode,
      plaats: req.body.plaats,
      btwNr: req.body.btwNr
    });
    var message = 'Contact toegevoegd';
    newContact.save(function(err) {
      if (err) {
        var message = 'Contact niet toegevoegd';
      }
    });
  }
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      console.log("settings found " + settings[0]);
    } else {
      console.log("ERR: settings not found!");
      console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
    }
    res.render('add-contact', {
      msg: message,
      "description": "Contact toevoegen",
      "settings": settings[0]
    });
  });
});

app.post('/add-bestelling/:idf', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      var newBestelling = new Bestelling({
        beschrijving: req.body.beschrijving,
        aantal: req.body.aantal,
        bedrag: req.body.bedrag,
        factuur: req.params.idf,
        totaal: req.body.aantal * req.body.bedrag
      })
      newBestelling.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
      var
      res.redirect('/bestellingen/' + req.params.idf);
    }
  });
});

app.get('/add-bestelling/:idf', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Settings.find({}, function(err, settings) {
        if (!err && settings.length != 0) {
        } else {
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              console.log("err in settings: " + err);
            }
          });
        }
        res.render('add-bestelling', {
          'factuur': factuur,
          "description": "Bestelling toevoegen",
          "settings": settings[0]
        });
      });
    }
  });
});

app.get('/edit-bestelling/:id', function(req, res) {
  Bestelling.findOne({
    _id: req.params.id
  }, function(err, bestelling) {
    Factuur.findOne({
      _id: bestelling.factuur
    }, function(err, factuur) {
      Settings.find({}, function(err, settings) {
        if (!err && settings.length != 0) {
        } else {
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              console.log("err in settings: " + err);
            }
          });
        }
        res.render('edit-bestelling', {
          'bestelling': bestelling,
          "factuur": factuur,
          "description": "Bestelling aanpassen",
          "settings": settings[0]
        });
      });
    });
  });
});

app.post('/edit-bestelling/:id', function(req, res) {
  var updateBestelling = {
    beschrijving: req.body.beschrijving,
    aantal: req.body.aantal,
    bedrag: req.body.bedrag,
    totaal: req.body.aantal * req.body.bedrag,
  }
  Bestelling.update({
    _id: req.params.id
  }, updateBestelling, function(err, numrows) {
    Bestelling.findOne({
      _id: req.params.id
    }, function(err, bestelling) {
      if (!err) {
        res.redirect('/bestellingen/' + bestelling.factuur);
      } else {
        console.log("err edit-bestelling POST : " + err);
      }
    });
  });
});

app.get('/edit-contact/:id', function(req, res) {
  Contact.findOne({
    _id: req.params.id
  }, function(err, docs) {
    Settings.find({}, function(err, settings) {
      if (!err && settings.length != 0) {
      } else {
        legeSettings = new Settings();
        legeSettings.save(function(err) {
          if (err) {
            console.log("err in settings: " + err);
          }
        });
      }
      res.render('edit-contact', {
        'contact': docs,
        "description": "Contact aanpassen",
        "settings": settings[0]
      });
    });
  });
});

app.get('/bestelbon/:idf', function(req, res) {
  var id = req.params.id;

  Profile.find({}, function(err, profile) {
    Factuur.findOne({
      _id: req.params.idf
    }, function(err, factuur) {
      if (err)
        console.log("err: " + err);
      Contact.findOne({
        _id: factuur.contact
      }, function(err2, contact) {
        if (err2)
          console.log("err: " + err2);
        Bestelling.find({
          factuur: factuur._id
        }, function(err3, bestellingen) {
          if (err3) {
            console.log("err: " + err3);
          }
          var lengte = Number(bestellingen.length);
          var json_data = "[";
          for (var i = 0; i <= lengte - 1; i++) {
            json_data += ("{\"beschrijving\" : \"" + bestellingen[Number(i)].beschrijving + "\", " +
              "\"aantal\" : " + bestellingen[Number(i)].aantal + ", " +
              "\"bedrag\" : " + bestellingen[Number(i)].bedrag + ", " +
              "\"totaal\" : " + Number(bestellingen[Number(i)].aantal * bestellingen[Number(i)].bedrag) + " }");
            if (i <= lengte - 2) {
              json_data += ",";
            }
          }
          json_data += "]";
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
            } else {
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('bestelbon', {
              'profile': profile[0],
              'contact': contact,
              'bestellingen': json_data,
              "factuur": factuur,
              'lengte': lengte,
              "settings": settings[0]
            });
          });
        });
      });
    });
  });
});

app.get('/createPDF/:idf', function(req, res) {
  var id = req.params.id;
  Profile.find({}, function(err, profile) {
    Factuur.findOne({
      _id: req.params.idf
    }, function(err, factuur) {
      if (err)
        console.log("err: " + err);
      Contact.findOne({
        _id: factuur.contact
      }, function(err2, contact) {
        if (err2)
          console.log("err: " + err2);
        Bestelling.find({
          factuur: factuur._id
        }, function(err3, bestellingen) {
          if (err3) {
            console.log("err: " + err3);
          }
          var lengte = Number(bestellingen.length);
          var json_data = "[";
          for (var i = 0; i <= lengte - 1; i++) {
            json_data += ("{\"beschrijving\" : \"" + bestellingen[Number(i)].beschrijving + "\", " +
              "\"aantal\" : " + bestellingen[Number(i)].aantal + ", " +
              "\"bedrag\" : " + bestellingen[Number(i)].bedrag + ", " +
              "\"totaal\" : " + Number(bestellingen[Number(i)].aantal * bestellingen[Number(i)].bedrag) + " }");
            if (i <= lengte - 2) {
              json_data += ",";
            }
          }
          json_data += "]";
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
            } else {
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('pdf', {
              'profile': profile[0],
              'contact': contact,
              'bestellingen': json_data,
              "factuur": factuur,
              'lengte': lengte,
              "settings": settings[0]
            });
          });
        });
      });
    });
  });
});

app.get('/offerte/:idf', function(req, res) {
  var id = req.params.id;
  Profile.find({}, function(err, profile) {
    Factuur.findOne({
      _id: req.params.idf
    }, function(err, factuur) {
      if (err)
        console.log("err: " + err);
      Contact.findOne({
        _id: factuur.contact
      }, function(err2, contact) {
        if (err2)
          console.log("err: " + err2);
        Bestelling.find({
          factuur: factuur._id
        }, function(err3, bestellingen) {
          if (err3) {
            console.log("err: " + err3);
          }
          var lengte = Number(bestellingen.length);
          var json_data = "[";
          for (var i = 0; i <= lengte - 1; i++) {
            json_data += ("{\"beschrijving\" : \"" + bestellingen[Number(i)].beschrijving + "\", " +
              "\"aantal\" : " + bestellingen[Number(i)].aantal + ", " +
              "\"bedrag\" : " + bestellingen[Number(i)].bedrag + ", " +
              "\"totaal\" : " + Number(bestellingen[Number(i)].aantal * bestellingen[Number(i)].bedrag) + " }");
            if (i <= lengte - 2) {
              json_data += ",";
            }
          }
          json_data += "]";
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
            } else {
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('offerte', {
              'profile': profile[0],
              'contact': contact,
              'bestellingen': json_data,
              "factuur": factuur,
              'lengte': lengte,
              "settings": settings[0]
            });
          });
        });
      });
    });
  });
});

app.post('/edit-contact/:id', function(req, res) {
  var updateData = {
    firma: req.body.firma,
    contactPersoon: req.body.contactPersoon,
    straat: req.body.straat,
    straatNr: req.body.straatNr,
    postcode: req.body.postcode,
    plaats: req.body.plaats,
    btwNr: req.body.btwNr,
  };
  var message = 'Factuur niet geupdate';
  Contact.update({
    _id: req.params.id
  }, updateData, function(err, numrows) {
    if (!err) {
      res.redirect('/edit-contact/' + req.params.id);
    }
  });
});

app.get('/add-offerte/:idc', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  console.log(datum);
  var nroff = 0;
  var idn;
  var _n = null;
  var factuurID;
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    if (!err) {
      contact.save(function(err) {
        Profile.find({}, function(err, nummer) {
          if (!err) {
            var _n = nummer;
            nroff = nummer[0].nroff;
            nummer[0].save(function(err) {
              if (!err) {
                Profile.updateOne({
                  nroff: nroff + 1
                }, function(err) {
                  if (!err) {
                    var nr_str = nroff.toString();
                    if (nr_str.toString().length == 1) {
                      nr_str = "00" + nroff.toString();
                    } else if (nr_str.toString().length == 2) {
                      nr_str = "0" + nroff.toString();
                    }

                    const newFactuur = new Factuur({
                      contact: contact._id,
                      datum: datum,
                      offerteNr: String(jaar + nr_str),
                      contactPersoon: contact.contactPersoon
                    });
                    Contact.updateOne({
                      aantalFacturen: contact.aantalFacturen + 1
                    }, function(err) {
                      if (err) {
                        console.log("err contact.updateOne: " + err);
                      } else {
                        contact.facturen.push(newFactuur._id);
                      }
                    });
                    newFactuur.save(function(err) {
                      if (err) {
                        console.log("err newFactuur: " + err);
                      }
                    });
                    Factuur.find({
                      contact: req.params.idc
                    }, function(err, facturen) {
                      if (!err) {
                        res.redirect('/facturen/' + contact._id);
                      } else {
                        console.log("err factuur.find: " + err);
                      }
                    });

                  } else {
                    console.log("1" + err);
                  }
                });
              } else {
                console.log("2" + err);
              }
            });
          } else {
            console.log("3" + err);
          }
        });
      });
    } else {
      console.log("4" + err);
    }
  });
});

app.get('/add-factuur/:idc', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  console.log(datum);
  var nr = 0;
  var idn;
  var _n = null;
  var factuurID;
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    if (!err) {
      contact.save(function(err) {
        if (!err) {
          Profile.find({}, function(err, nummer) {
            if (!err) {
              var _n = nummer;
              nr = nummer[0].nr;
            }
            nummer[0].save(function(err) {
              Profile.updateOne({
                nr: nr + 1
              }, function(err) {
                if (err) {
                  console.log("error in profile: " + err);
                } else {
                  var nr_str = nr.toString();
                  if (nr_str.toString().length == 1) {
                    nr_str = "00" + nr.toString();
                  } else if (nr_str.toString().length == 2) {
                    nr_str = "0" + nr.toString();
                  }
                  const newFactuur = new Factuur({
                    contact: contact._id,
                    datum: datum,
                    factuurNr: String(jaar + nr_str),
                    contactPersoon: contact.contactPersoon
                  });
                  Contact.updateOne({
                    aantalFacturen: contact.aantalFacturen + 1
                  }, function(err) {
                    if (err) {
                      console.log("err contact.updateOne: " + err);
                    } else {
                      contact.facturen.push(newFactuur._id);
                    }
                  });
                  newFactuur.save(function(err) {
                    if (err) {
                      console.log("err newFactuur: " + err);
                    }
                  });
                  Factuur.find({
                    contact: req.params.idc
                  }, function(err, facturen) {
                    if (!err) {
                      res.redirect('/facturen/' + contact._id);
                    } else {
                      console.log("err factuur.find: " + err);
                    }
                  });
                }
              });
            });
          });
        } else {
          console.log("err contact.save: " + err);
        }
      });
    }
  });
});

app.get('/opwaardeer/:idf', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Profile.find({}, function(err, profile) {
        if (!err) {
          profile[0].save(function(err) {
            Profile.updateOne({
              nr: profile[0].nr + 1
            }, function(err) {
              var nr_str = profile[0].nr.toString();
              if (nr_str.toString().length == 1) {
                nr_str = "00" + profile[0].nr.toString();
              } else if (nr_str.toString().length == 2) {
                nr_str = "0" + profile[0].nr.toString();
              }
              var updateFactuur = {
                datum: datum,
                factuurNr: String(jaar + nr_str)
              };
              Factuur.update({
                _id: req.params.idf
              }, updateFactuur, function(err, factuur1) {
                res.redirect('/facturen/' + factuur.contact);
              });
            });
          });
        } else {
          console.log(err);
        }
      });

    } else {
      console.log(err);
    }
  });
});

app.get('/opwaardeer/:idf/t', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Profile.find({}, function(err, profile) {
        if (!err) {
          profile[0].save(function(err) {
            Profile.updateOne({
              nr: profile[0].nr + 1
            }, function(err) {
              var nr_str = profile[0].nr.toString();
              if (nr_str.toString().length == 1) {
                nr_str = "00" + profile[0].nr.toString();
              } else if (nr_str.toString().length == 2) {
                nr_str = "0" + profile[0].nr.toString();
              }
              var updateFactuur = {
                datum: datum,
                factuurNr: String(jaar + nr_str)
              };
              Factuur.update({
                _id: req.params.idf
              }, updateFactuur, function(err, factuur1) {
                console.log(factuur);
                res.redirect('/facturen');
              });
            });
          });
        } else {
          console.log(err);
        }
      });

    } else {
      console.log(err);
    }
  });
});

app.get('/delete-contact/:id', function(req, res) {
  var contact_id = req.params.id;
  Contact.remove({
    _id: req.params.id
  }, function(err) {
    if (!err) {
      Factuur.remove({
        contact: req.params.id
      }, function(err) {
        if (!err) {
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
  Contact.find({}, function(err, contacten) {
    Settings.find({}, function(err, settings) {
      if (!err && settings.length != 0) {
      } else {
        legeSettings = new Settings();
        legeSettings.save(function(err) {
          if (err) {
            console.log("err in settings: " + err);
          }
        });
      }
      res.redirect('/contacten');
    });
  });
});

app.get('/delete-factuur/:idc/:idf', function(req, res) {
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    Factuur.deleteOne({
      _id: req.params.idf
    }, function(err) {
      if (!err) {
        Factuur.find({
          contact: req.params.idc
        }, function(err, facturen) {
          if (!err) {
            Settings.find({}, function(err, settings) {
              if (!err && settings.length != 0) {
              } else {
                legeSettings = new Settings();
                legeSettings.save(function(err) {
                  if (err) {
                    console.log("err in settings: " + err);
                  }
                });
              }
              res.render('facturen', {
                'contact': contact,
                'facturenLijst': facturen,
                'description': "Facturen van " + contact.contactPersoon,
                "settings": settings[0]
              });
            });
          } else {
            console.log("err factuur.find: " + err);
          }
        });

      } else {
        console.log("err factuur.deleteOne: " + err);
      }
    });
  });
});

app.get('/delete-factuur/:idc/:idf/t', function(req, res) {
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    Factuur.deleteOne({
      _id: req.params.idf
    }, function(err) {
      if (!err) {
        Factuur.find({}, function(err, facturen) {
          if (!err) {
            Settings.find({}, function(err, settings) {
              if (!err && settings.length != 0) {
              } else {
                legeSettings = new Settings();
                legeSettings.save(function(err) {
                  if (err) {
                    console.log("err in settings: " + err);
                  }
                });
              }
              res.render('facturen', {
                'facturenLijst': facturen,
                'description': 'Alle facturen',
                'settings': settings[0]
              });
            });
          } else {
            console.log("err factuur.find: " + err);
          }
        });

      } else {
        console.log("err factuur.deleteOne: " + err);
      }
    });
  });
});

app.get('/delete-bestelling/:idb', function(req, res) {
  Bestelling.findOne({
    _id: req.params.idb
  }, function(err, bestelling) {
    Factuur.findOne({
      _id: bestelling.factuur
    }, function(err, factuur) {
      Bestelling.deleteOne({
        _id: req.params.idb
      }, function(err) {
        if (!err) {
          res.redirect('/bestellingen/' + factuur._id);
        } else {
          console.log("err bestelling.find: " + err);
        }
      });
    });
  });
});

app.get('/facturen/:idc', function(req, res) {
  var contact;
  Contact.findOne({
    _id: req.params.idc
  }, function(err, _contact) {
    if (!err) {
      contact = _contact;
      Factuur.find({
        contact: req.params.idc
      }, function(err, facturen) {
        if (!err) {
          console.log(facturen);
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
              console.log("settings found " + settings[0]);
            } else {
              console.log("ERR: settings not found!");
              console.log("settings object is nog niet gemaakt, nieuwe word gecreërd");
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('facturen', {
              'contact': contact,
              'facturenLijst': facturen,
              'description': "Facturen van " + contact.contactPersoon,
              "settings": settings[0]
            });
          });
        } else {
          console.log("err factuur.find: " + err);
        }
      });
    } else {
      console.log("err contact.findOne: " + err);
    }
  });
});

app.get('/facturen/:idc/t', function(req, res) {
  var contact;
  Contact.findOne({
    _id: req.params.idc
  }, function(err, _contact) {
    if (!err) {
      contact = _contact;
      Factuur.find({
        contact: req.params.idc
      }, function(err, facturen) {
        if (!err) {
          console.log(facturen);
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
            } else {
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('facturen', {
              'terug': 1,
              'contact': contact,
              'facturenLijst': facturen,
              'description': "Facturen van " + contact.contactPersoon,
              "settings": settings[0]
            });
          });
        } else {
          console.log("err factuur.find: " + err);
        }
      });
    } else {
      console.log("err contact.findOne: " + err);
    }
  });
});

app.get('/facturen', function(req, res) {
  Factuur.find({}, function(err, facturen) {
    if (!err) {
      console.log(facturen);
      Settings.find({}, function(err, settings) {
        if (!err && settings.length != 0) {
        } else {
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              console.log("err in settings: " + err);
            }
          });
        }
        res.render('facturen', {
          'facturenLijst': facturen,
          'description': "Alle facturen",
          "settings": settings[0]
        });
      });
    } else {
      console.log("err factuur.find: " + err);
    }
  });
});

app.get('/bestellingen/:idf', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Contact.findOne({
        _id: factuur.contact
      }, function(err, contact) {
        if (!err) {
          Bestelling.find({
            factuur: req.params.idf
          }, function(err, bestellingen) {
            if (!err) {
              Settings.find({}, function(err, settings) {
                if (!err && settings.length != 0) {
                } else {
                  legeSettings = new Settings();
                  legeSettings.save(function(err) {
                    if (err) {
                      console.log("err in settings: " + err);
                    }
                  });
                }
                res.render('bestellingen', {
                  'factuur': factuur,
                  'bestellingen': bestellingen,
                  'description': "Bestellingen van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
                  "settings": settings[0]
                });
              });
            }
          });
        }
      });
    }
  });
});

app.get('/bestellingen/:idf/t', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Contact.findOne({
        _id: factuur.contact
      }, function(err, contact) {
        if (!err) {
          Bestelling.find({
            factuur: req.params.idf
          }, function(err, bestellingen) {
            if (!err) {
              Settings.find({}, function(err, settings) {
                if (!err && settings.length != 0) {
                } else {
                  legeSettings = new Settings();
                  legeSettings.save(function(err) {
                    if (err) {
                      console.log("err in settings: " + err);
                    }
                  });
                }
                res.render('bestellingen', {
                  'terug': 1,
                  'factuur': factuur,
                  'bestellingen': bestellingen,
                  'description': "Bestellingen van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
                  "settings": settings[0]
                });
              });
            }
          });
        }
      });
    }
  });
});

app.get('/view-contact/:idc', function(req, res) {
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    if (!err) {
      Settings.find({}, function(err, settings) {
        if (!err && settings.length != 0) {
        } else {
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              console.log("err in settings: " + err);
            }
          });
        }
        res.render('view-contact', {
          'contact': contact,
          "description": "Contact Bekijken",
          "settings": settings[0]
        });
      });
    } else {
      console.log("err view-contact: " + err);
    }
  });
});

app.get('/edit-profile/', function(req, res) {
  var legeProfiel;
  var date = new Date();
  var _jaar = date.getFullYear();
  var jaar = _jaar.toString();
  Profile.find({}, function(err, profile) {
    if (!err) {
      if (profile.length == 0) {
        legeProfiel = new Profile();
        legeProfiel.save(function(err) {
          if (err) {
            console.log("err edit-profile: " + err);
          }
        });
        console.log(legeProfiel)
        res.render('edit-profile', {
          'profile': legeProfiel
        });
      } else {
        console.log("\nprofile: " + profile[0]);
        var _nr = profile[0].nr;
        var nr_str = _nr.toString();
        if (nr_str.toString().length == 1) {
          nr_str = "00" + _nr.toString();
        } else if (nr_str.toString().length == 2) {
          nr_str = "0" + _nr.toString();
        }
        var _nroff = profile[0].nroff;
        var nroff_str = _nroff.toString();
        if (nroff_str.toString().length == 1) {
          nroff_str = "00" + _nroff.toString();
        } else if (nroff_str.toString().length == 2) {
          nroff_str = "0" + _nroff.toString();
        }
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          res.render('edit-profile', {
            'profile': profile[0],
            'nroff': Number(jaar + nroff_str),
            'nr': Number(jaar + nr_str),
            "description": "Profiel bijwerken",
            "settings": settings[0]
          });
        });
      }
    }
  });
});

app.post('/edit-profile/:id', function(req, res) {

  var _nr2 = req.body.nr.toString();
  console.log(_nr2);
  var _nr = Number(_nr2.substring(_nr2.length - 3));
  console.log(_nr);

  var _nroff2 = req.body.nroff.toString();
  console.log("\n" + _nroff2);
  var _nroff = Number(_nroff2.substring(_nroff2.length - 3));
  console.log(_nroff);
  var updateProfile = {
    firma: req.body.firma,
    naam: req.body.naam,
    straat: req.body.straat,
    straatNr: req.body.straatNr,
    postcode: req.body.postcode,
    plaats: req.body.plaats,
    btwNr: req.body.btwNr,
    iban: req.body.iban,
    bic: req.body.bic,
    nr: _nr,
    nroff: _nroff,
    tele: req.body.tele,
    mail: req.body.mail
  };
  Profile.update({
    _id: req.params.id
  }, updateProfile, function(err, updatedprofile) {
    if (!err) {
      res.redirect('/');
    } else {
      console.log(err);
    }
  });
});

app.get('/edit-factuur/:idc/:idf', function(req, res) {
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    Factuur.findOne({
      _id: req.params.idf
    }, function(err, factuur) {
      if (!err) {
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          res.render('edit-factuur', {
            'factuur': factuur,
            'contact': contact,
            "description": "Factuur aanpassen van " + contact.contactPersoon,
            "settings": settings[0]
          });
        });
      } else {
        console.log("err edit-factuur GET: " + err);
      }
    });
  });
});

app.get('/updateFactuur/:idf', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Contact.findOne({
        _id: factuur.contact
      }, function(err, contact) {
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          var updateFactuur = {
            contactPersoon: contact.contactPersoon
          }
          Factuur.update({
            _id: req.params.idf
          }, updateFactuur, function(err, updateFactuur) {
            Factuur.find({}, function(err, facturen) {
              res.render('facturen', {
                'facturenLijst': facturen,
                'description': "Alle facturen",
                "settings": settings[0]
              })
            });
          });
        });
      })
    } else {
      console.log(err);
    }
  });
});

app.get('/edit-factuur/:idc/:idf/t', function(req, res) {
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    Factuur.findOne({
      _id: req.params.idf
    }, function(err, factuur) {
      if (!err) {
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          res.render('edit-factuur', {
            'terug': 1,
            'factuur': factuur,
            'contact': contact,
            "description": "Factuur aanpassen van " + contact.contactPersoon,
            "settings": settings[0]
          });
        });
      } else {
        console.log("err edit-factuur GET: " + err);
      }
    });
  });
});

app.post('/edit-factuur/:idc/:idf', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  var updateFactuur = {
    datum: req.body.datum,
    factuurNr: req.body.factuurNr,
    voorschot: req.body.voorschot,
    offerteNr: req.body.offerteNr
  };
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    console.log(contact)
    Factuur.update({
      _id: req.params.idf
    }, updateFactuur, function(err, factuur) {
      if (!err) {
        console.log(factuur);
        res.redirect('/facturen/' + contact._id);
      } else {
        console.log(err);
      }
    });

  });
});

app.post('/edit-factuur/:idc/:idf/t', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  var updateFactuur = {
    datum: req.body.datum,
    factuurNr: req.body.factuurNr,
    voorschot: req.body.voorschot,
    offerteNr: req.body.offerteNr
  };
  Contact.findOne({
    _id: req.params.idc
  }, function(err, contact) {
    console.log(contact)
    Factuur.update({
      _id: req.params.idf
    }, updateFactuur, function(err, factuur) {
      if (!err) {
        console.log(factuur);
        res.redirect('/facturen/');
      } else {
        console.log(err);
      }
    });

  });
});

app.get('/view-factuur/:idf', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Contact.findOne({
        _id: factuur.contact
      }, function(err, contact) {
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          res.render('view-factuur', {
            'factuur': factuur,
            'contact': contact,
            "description": "Bekijk factuur van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
            "settings": settings[0]
          });
        });
      });
    }
  });
});

app.get('/view-factuur/:idf/t', function(req, res) {
  Factuur.findOne({
    _id: req.params.idf
  }, function(err, factuur) {
    if (!err) {
      Contact.findOne({
        _id: factuur.contact
      }, function(err, contact) {
        Settings.find({}, function(err, settings) {
          if (!err && settings.length != 0) {
          } else {
            legeSettings = new Settings();
            legeSettings.save(function(err) {
              if (err) {
                console.log("err in settings: " + err);
              }
            });
          }
          res.render('view-factuur', {
            'terug': 1,
            'factuur': factuur,
            'contact': contact,
            "description": "Bekijk factuur van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
            "settings": settings[0]
          });
        });
      });
    }
  });
});

app.get('/view-bestelling/:idb', function(req, res) {
  Bestelling.findOne({
    _id: req.params.idb
  }, function(err, bestelling) {
    if (!err) {
      Factuur.findOne({
        _id: bestelling.factuur
      }, function(err, factuur) {
        if (!err) {
          Settings.find({}, function(err, settings) {
            if (!err && settings.length != 0) {
            } else {
              legeSettings = new Settings();
              legeSettings.save(function(err) {
                if (err) {
                  console.log("err in settings: " + err);
                }
              });
            }
            res.render('view-bestelling', {
              'bestelling': bestelling,
              "factuur": factuur,
              "description": "Bekijk bestelling",
              "settings": settings[0]
            });
          });
        }
      });
    }
  });
});

app.get('/change-betaald/:id', function(req, res) {
  Factuur.findOne({
    _id: req.params.id
  }, function(err, factuur) {
    if (!err) {
      console.log("factuur found: " + factuur);
      var voor = new Boolean();
      voor = !(factuur.isBetaald);
      console.log("change betaald to " + voor);
      //update(req.params.idf,voor);
      Factuur.updateOne({
        _id: req.params.id
      }, {
        isBetaald: voor
      }, function(err, result) {
        if (!err) {
          console.log("result" + result);
          res.redirect('/facturen/' + factuur.contact);
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.get('/change-betaald2/:id', function(req, res) {
  Factuur.findOne({
    _id: req.params.id
  }, function(err, factuur) {
    if (!err) {
      console.log("factuur found: " + factuur);
      var voor = new Boolean();
      voor = !(factuur.isBetaald);
      console.log("change betaald to " + voor);
      //update(req.params.idf,voor);
      Factuur.updateOne({
        _id: req.params.id
      }, {
        isBetaald: voor
      }, function(err, result) {
        if (!err) {
          console.log("result" + result);
          res.redirect('/facturen/');
        }
      });
    } else {
      console.log(err);
    }
  });
});

app.get('/settings', function(req, res) {
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('settings', {
        'settings': settings[0],
        'description': "Settings"
      });
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
      console.log(legeSettings);
      res.redirect('/settings');
      if (err) {
        console.log(err);
      }
    }
  });
});

app.get('/change-theme/:th', function(req, res) {
  Settings.find({}, function(err, settings) {
    if (!err) {
      var oppo;
      var nav;
      if (req.params.th == "dark") {
        oppo = "light";
        nav = "dark";
      } else if (req.params.th == "primary") {
        oppo = "outline-primary";
        nav = "dark";
      } else if (req.params.th == "light") {
        oppo = "secondary";
        nav = "light";
      } else if (req.params.th == "secondary") {
        oppo = "secondary";
        nav = "dark";
      } else if (req.params.th == "info") {
        oppo = "outline-info";
        nav = "dark"
      } else if (req.params.th == "danger") {
        oppo = "outline-danger";
        nav = "dark";
      }
      var updateSettings = {
        thema: req.params.th,
        oppo: oppo,
        nav: nav
      };
      Settings.update({
        _id: settings[0]._id
      }, updateSettings, function(err, updatedSettings) {
        if (!err) {
          res.redirect('/settings');
        } else {
          console.log(err);
        }
      });
    } else {
      console.log("err");
      res.redirect('/');
    }
  });
});

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.listen('3000', function() {
  console.log('Server is running at PORT ' + 3000);
  Schema = mongoose.Schema;

});

async function update(id, voor) {
  await Factuur.updateOne({
    _id: id
  }, {
    isBetaald: voor
  });
  console.log("updated");
}
