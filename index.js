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
var maand_klein = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
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
  nrcred:{
    type:Number,
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
  creditnr:{
    type:Number
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
  },
  lang:{
    type: String,
    defaul: "nl"
  },
  mail:{
    type: String
  },
  mail1:{
    type:String
  },
  mail2:{
    type:String
  },
  rekeningnr:{
    type:String
  }
});

var Contact = mongoose.model('Contact', ContactSchema);

var MateriaalSchema = new Schema({
  naam:{
    type: String
  },
  prijs:{
    type: Number,
    default: 0
  }
});

var Materiaal = mongoose.model('Materiaal',MateriaalSchema);

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
      "settings": settings[0],
      "jaar": new Date().getFullYear()
    });
  });
});


app.get('/chart/:jaar', function(req, res) {
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      Factuur.find({},function(err,facturen){
        if(!err){
          var totaal = [0,0,0,0,0,0,0,0,0,0,0,0];
          for(var i=0; i<=11;i++){
            for(var factuur of facturen){
              if(factuur.datum.includes(maand[i]) || factuur.datum.includes(maand_klein[i])){
                if(factuur.datum.includes(req.params.jaar)){ //current year
                  if(factuur.factuurNr){ //only factuur not offerte
                    totaal[i] += factuur.totaal;
                  }
                }
              }
            }
          }
          res.render('chart', {
            "totaal" : totaal,
            "description": "Grafiek",
            "settings": settings[0],
            "jaar": req.params.jaar
          });
        }else{
          console.log(err);
        }
      });
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
    }
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
      btwNr: req.body.btwNr,
      lang: req.body.lang,
      mail: req.body.mail,
      mail1: req.body.mail1,
      mail2: req.body.mail2,
      rekeningnr: req.body.rekeningnr
    });
    var message = 'Contact toegevoegd';
    newContact.save(function(err) {
      if (err) {
        var message = 'Contact niet toegevoegd';
      }
    });
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
  }
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
      Factuur.findOne({_id: req.params.idf},function(err,factuur){
        if(!err){
          var totFac = ((((factuur.totaal+factuur.voorschot)+(req.body.aantal*req.body.bedrag))-factuur.voorschot));
          console.log(totFac+" = (("+factuur.totaal+"+("+req.body.aantal+"*"+req.body.bedrag+")-"+factuur.voorschot+"))");
          var newFactuur={
            totaal: totFac
          }
          Factuur.update({_id: req.params.idf},newFactuur,function(err,factuurnew){
                if(!err){

                }else{
                  console.log(err);
                }
          });
        }else{
          console.log(err);
        }
      });
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
          res.render('add-bestelling', {
            'factuur': factuur,
            "description": "Bestelling toevoegen",
            "settings": settings[0]
          });
        } else {
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              console.log("err in settings: " + err);
            }
          });
        }
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
  Bestelling.findOne({_id:req.params.id},function(err,bestelling){
        var updateBestelling = {
          beschrijving: req.body.beschrijving,
          aantal: req.body.aantal,
          bedrag: req.body.bedrag,
          totaal: req.body.aantal * req.body.bedrag,
        }
        Factuur.findOne({_id: bestelling.factuur},function(err,factuur){
          Bestelling.update({_id: req.params.id}, updateBestelling, function(err, numrows) {
                    if(!err){
                      var tot = factuur.totaal-(bestelling.aantal*bestelling.bedrag);
                      console.log(tot +"="+factuur.totaal+"-("+bestelling.aantal+"*"+bestelling.bedrag+")");
                      console.log(tot+"+("+req.body.aantal+"*"+req.body.bedrag+")-"+factuur.voorschot+")");
                          var newFactuur={
                            totaal: ((tot+(req.body.aantal*req.body.bedrag)-factuur.voorschot))
                          }
                          Factuur.update({_id: bestelling.factuur},newFactuur,function(err,factuurnew){
                                if(!err){
                                  res.redirect('/bestellingen/' + bestelling.factuur);
                                }else{
                                  console.log(err);
                                }
                          });
                    }
              });
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

app.get('/creditnota/:idc',function(req,res){
  var id = req.params.idc;
  Profile.find({},function(err,profile){
    Factuur.findOne({_id:id},function(err,factuur){
      if(err){
        console.log(err);
      }else{
        Contact.findOne({_id:factuur.contact},function(err,contact){
          Bestelling.find({factuur:factuur._id},function(err,bestellingen){
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
              res.render('creditnota', {
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
      }
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

app.get('/createPDF-eng/:idf', function(req, res) {
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
            res.render('pdf-eng', {
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
    lang: req.body.lang,
    mail: req.body.mail,
    mail1: req.body.mail1,
    mail2: req.body.mail2,
    rekeningnr: req.body.rekeningnr
  };
  console.log(req.body.lang);
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

app.get('/add-creditnota/:idc', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
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
              nr = nummer[0].nrcred;
            }
            nummer[0].save(function(err) {
              Profile.updateOne({
                nrcred: nr + 1
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
                    creditnr: String(jaar + nr_str),
                    contactPersoon: contact.contactPersoon,
                    totaal:0,
                  });
                  console.log(newFactuur);
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

app.get('/add-factuur/:idc', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
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
                    contactPersoon: contact.contactPersoon,
                    totaal:0
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

app.get('/delete-creditnota/:idc/:idf', function(req, res) {
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
              var newFactuur={
                totaal: factuur.totaal -(bestelling.aantal*bestelling.bedrag)
              }
              Factuur.update({_id: factuur._id},newFactuur,function(err,factuurnew){
                    if(!err){

                    }else{
                      console.log(err);
                    }
              });
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
      Factuur.find({  contact: req.params.idc}).sort('-factuurNr').exec(function(err, facturen) {
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
      Factuur.find({  contact: req.params.idc}).sort('-factuurNr').exec(function(err, facturen) {
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
  Factuur.find({}).sort('-factuurNr').exec(function(err, facturen) {
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
        var _nrcred = profile[0].nrcred;
        var nrcred_str = _nrcred.toString();
        if (nrcred_str.toString().length == 1) {
          nrcred_str = "00" + _nrcred.toString();
        } else if (nrcred_str.toString().length == 2) {
          nrcred_str = "0" + _ncred.toString();
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
            'nrcred': Number(jaar+nrcred_str),
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
  var _nr = Number(_nr2.substring(_nr2.length - 3));

  var _nroff2 = req.body.nroff.toString();
  var _nroff = Number(_nroff2.substring(_nroff2.length - 3));

  var _nrcred2 = req.body.nrcred.toString();
  var _nrcred = Number(_nrcred2.substring(_nrcred2.length - 3));
  console.log(_nrcred);

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
    nrcred: _nrcred,
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

app.get('/edit-creditnota/:idc/:idf', function(req, res) {
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
          res.render('edit-creditnota', {
            'factuur': factuur,
            'contact': contact,
            "description": "creditnota aanpassen van " + contact.contactPersoon,
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

app.post('/zoeken', function(req,res){
  var str = req.body.search.toString().toLowerCase();
  var contacten = [];
  var facturen = [];
  var bestellingen = [];
  console.log("ZOEKEN OP \""+str+"\"");
  Contact.find({},function(err,contacten_){
    if(!err){
      Factuur.find({},function(err,facturen_){
        if(!err){
          Bestelling.find({},function(err,bestellingen_){
            if(!err){
              //BESTELLINGEN
              for(var bestelling of bestellingen_){
                if(String(bestelling.beschrijving).toLowerCase().includes(String(str).toLowerCase())){
                  bestellingen.push(bestelling);
                }
              }
              //Facturen
              for(var factuur of facturen_){
                if(isNumeric(str)){
                  if(String(factuur.factuurNr).includes(str)){
                    facturen.push(factuur);
                  }else if(String(factuur.offerteNr).includes(str)){
                    facturen.push(factuur);
                  }
                }
              }
              //Contacten
              for(var contact of contacten_){
                if(String(contact.contactPersoon).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.postcode).includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.plaats).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.mail).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.mail2).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.mail3).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.firma).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
                if(String(contact.straat).toLowerCase().includes(str)){
                  contacten.push(contact);
                }
              }
              //takes only 1 of each items, if found 2 or more of the same
              var contacten_d = distinct(contacten);
              var bestellingen_d = distinct(bestellingen);
              var facturen_d = distinct(facturen);
              Settings.find({}, function(err, settings) {
                if (!err && settings.length != 0) {
                  console.log("Dit gevonden:")
                  console.log(contacten+bestellingen+facturen);
                  console.log("redirecting");
                  res.render('zoeken',{"description":"Zoeken op \""+str+"\"","settings":settings[0],"contacten":contacten_d,"bestellingen":bestellingen_d,"facturen":facturen_d});
                } else {
                  legeSettings = new Settings();
                  legeSettings.save(function(err) {
                    if (err) {
                      console.log("err in settings: " + err);
                    }
                  });
                }
              });
            }else{console.log(err);}
          });
        }else{console.log(err);}
      });
    }else{console.log(err);}
  });
});

function distinct(_array){
  var array = _array;
  var disctincts = [];
  for(var o of array){
    var isDistinct = true;
    for(var d of disctincts){
      if(d._id == o._id){
        isDistinct = false;
      }
    }
    if(isDistinct){
      disctincts.push(o);
    }
  }
  return disctincts;
}
app.get('/zoeken',function(req,res){res.redirect('/');});

app.post('/edit-factuur/:idc/:idf', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
    var totBes = 0
    for(var i= 0; i<=bestellingen.length-1; i++){
      totBes += bestellingen[i].totaal;
    }
    console.log(totBes);
    console.log(req.body.voorschot+"voorschot");
    console.log(factuur.voorschot+" :voorschot oud");
    var _t;
    if(req.body.voorschot){
       _t = totBes-req.body.voorschot;
       console.log("new");
     }else{
       var _t = totBes
    }
    console.log(_t+"="+totBes+"-("+factuur.voorschot+"-"+req.body.voorschot+")");
    if(req.body.voorschot != ""){
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr,
        totaal:_t
      };
    }else{
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr
      };
    }

    Contact.findOne({
      _id: req.params.idc
    }, function(err, contact) {
            Factuur.update({
              _id: req.params.idf
            }, updateFactuur, function(err, factuur) {
              if (!err) {
                res.redirect('/facturen/' + contact._id);
              } else {
                console.log(err);
              }
            });
        });
      });
  });
});

app.post('/edit-creditnota/:idc/:idf', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
    var totBes = 0
    for(var i= 0; i<=bestellingen.length-1; i++){
      totBes += bestellingen[i].totaal;
    }
    console.log(totBes);
    console.log(req.body.voorschot+"voorschot");
    console.log(factuur.voorschot+" :voorschot oud");
    var _t;
    if(req.body.voorschot){
       _t = totBes-req.body.voorschot;
       console.log("new");
     }else{
       var _t = totBes
    }
    console.log(_t+"="+totBes+"-("+factuur.voorschot+"-"+req.body.voorschot+")");
    if(req.body.voorschot != ""){
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        creditnr: req.body.creditnr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr,
        totaal:_t
      };
    }else{
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        voorschot: req.body.voorschot,
        creditnr: req.body.creditnr,
        offerteNr: req.body.offerteNr
      };
    }

    Contact.findOne({
      _id: req.params.idc
    }, function(err, contact) {
            Factuur.update({
              _id: req.params.idf
            }, updateFactuur, function(err, factuur) {
              if (!err) {
                res.redirect('/facturen/' + contact._id);
              } else {
                console.log(err);
              }
            });
        });
      });
  });
});

app.post('/edit-creditnota/:idc/:idf/t', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
    var totBes = 0
    for(var i= 0; i<=bestellingen.length-1; i++){
      totBes += bestellingen[i].totaal;
    }
    console.log(totBes);
    console.log(req.body.voorschot+"voorschot");
    console.log(factuur.voorschot+" :voorschot oud");
    var _t;
    if(req.body.voorschot){
       _t = totBes-req.body.voorschot;
       console.log("new");
     }else{
       var _t = totBes
    }
    console.log(_t+"="+totBes+"-("+factuur.voorschot+"-"+req.body.voorschot+")");
    if(req.body.voorschot != ""){
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        creditnr: req.body.creditnr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr,
        totaal:_t
      };
    }else{
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        creditnr: req.body.creditnr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr
      };
    }

    Contact.findOne({
      _id: req.params.idc
    }, function(err, contact) {
            Factuur.update({
              _id: req.params.idf
            }, updateFactuur, function(err, factuur) {
              if (!err) {
                res.redirect('/facturen/');
              } else {
                console.log(err);
              }
            });
        });
      });
  });
});

app.post('/edit-factuur/:idc/:idf/t', function(req, res) {
  var date = new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate() + " " + maand[date.getMonth()] + " " + jaar;
  Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
    var totBes = 0
    for(var i= 0; i<=bestellingen.length-1; i++){
      totBes += bestellingen[i].totaal;
    }
    console.log(totBes);
    console.log(req.body.voorschot+"voorschot");
    console.log(factuur.voorschot+" :voorschot oud");
    var _t;
    if(req.body.voorschot){
       _t = totBes-req.body.voorschot;
       console.log("new");
     }else{
       var _t = totBes
    }
    console.log(_t+"="+totBes+"-("+factuur.voorschot+"-"+req.body.voorschot+")");
    if(req.body.voorschot != ""){
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr,
        totaal:_t
      };
    }else{
      var updateFactuur = {
        datum: req.body.datum,
        factuurNr: req.body.factuurNr,
        voorschot: req.body.voorschot,
        offerteNr: req.body.offerteNr
      };
    }

    Contact.findOne({
      _id: req.params.idc
    }, function(err, contact) {
            Factuur.update({
              _id: req.params.idf
            }, updateFactuur, function(err, factuur) {
              if (!err) {
                res.redirect('/facturen/');
              } else {
                console.log(err);
              }
            });
        });
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

app.get('/view-creditnota/:idf', function(req, res) {
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
          res.render('view-ceditnota', {
            'factuur': factuur,
            'contact': contact,
            "description": "Bekijk creditnota van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
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

app.get('/view-creditnota/:idf/t', function(req, res) {
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
            "description": "Bekijk creditnota van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
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

app.get('/berekeningen',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('berekeningen', {
        'settings': settings[0],
        'description': "Alle berekeningen"
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

app.get('/prijs',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      Materiaal.find({},function(err,materialen){
        if(!err){
          res.render('prijs', {
            'settings': settings[0],
            'description': "Berekening voor Prijs",
            'materialen': materialen
          });
        }else{console.log(err);}
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

app.post('/prijs',function(req,res){
  var totaal = (req.body.uren*req.body.werkprijs);
  Materiaal.findOne({naam:req.body.o001},function(err,m001){
    totaal += req.body.i001*m001.prijs;
  Materiaal.findOne({naam:req.body.o002},function(err,m002){
    if(m002)
      totaal += req.body.i002*m002.prijs;
  Materiaal.findOne({naam:req.body.o003},function(err,m003){;
    if(m003)
      totaal += req.body.i003*m003.prijs;
  Materiaal.findOne({naam:req.body.o004},function(err,m004){
    if(m004)
      totaal += req.body.i004*m004.prijs;
  Materiaal.findOne({naam:req.body.o005},function(err,m005){
    if(m005)
      totaal += req.body.i005*m005.prijs;
  Materiaal.findOne({naam:req.body.o006},function(err,m006){
    if(m006)
      totaal += req.body.i006*m006.prijs;
  Materiaal.findOne({naam:req.body.o007},function(err,m007){
    if(m007)
      totaal += req.body.i007*m007.prijs;
  Materiaal.findOne({naam:req.body.o008},function(err,m008){
    if(m008)
      totaal += req.body.i008*m008.prijs;
  Materiaal.findOne({naam:req.body.o009},function(err,m009){
    if(m009)
      totaal += req.body.i009*m009.prijs;
  Materiaal.findOne({naam:req.body.o010},function(err,m010){
    if(m010)
      totaal += req.body.i010*m010.prijs;
  Materiaal.findOne({naam:req.body.o011},function(err,m011){
    if(m011)
      totaal += req.body.i011*m011.prijs;
  Materiaal.findOne({naam:req.body.o012},function(err,m012){
    if(m012)
      totaal += req.body.i012*m012.prijs;
  Materiaal.findOne({naam:req.body.o013},function(err,m013){
    if(m013)
      totaal += req.body.i013*m013.prijs;
  Materiaal.findOne({naam:req.body.o014},function(err,m014){
    if(m014)
      totaal += req.body.i014*m014.prijs;
  Materiaal.findOne({naam:req.body.o015},function(err,m015){
    if(m015)
      totaal += req.body.i015*m015.prijs;
  Materiaal.findOne({naam:req.body.o016},function(err,m016){
    if(m016)
      totaal += req.body.i016*m016.prijs;
  Materiaal.findOne({naam:req.body.o017},function(err,m017){
    if(m017)
      totaal += req.body.i017*m017.prijs;
  Materiaal.findOne({naam:req.body.o018},function(err,m018){
    if(m018)
      totaal += req.body.i018*m018.prijs;
  Materiaal.findOne({naam:req.body.o019},function(err,m019){
    if(m019)
      totaal += req.body.i019*m019.prijs;
  Materiaal.findOne({naam:req.body.o020},function(err,m020){
    if(m020)
      totaal += req.body.i020*m020.prijs;
  Materiaal.findOne({naam:req.body.o021},function(err,m021){
    if(m021)
      totaal += req.body.i021*m021.prijs;
  Materiaal.findOne({naam:req.body.o022},function(err,m022){
    if(m022)
      totaal += req.body.i022*m022.prijs;
  Materiaal.findOne({naam:req.body.o023},function(err,m023){
    if(m023)
      totaal += req.body.i023*m023.prijs;
  Materiaal.findOne({naam:req.body.o024},function(err,m024){
    if(m024)
      totaal += req.body.i024*m024.prijs;
  Materiaal.findOne({naam:req.body.o025},function(err,m025){
    if(m025)
      totaal += req.body.i025*m025.prijs;
  Materiaal.findOne({naam:req.body.o026},function(err,m026){
    if(m026)
      totaal += req.body.i026*m026.prijs;
  Materiaal.findOne({naam:req.body.o027},function(err,m027){
    if(m027)
      totaal += req.body.i027*m027.prijs;
  Materiaal.findOne({naam:req.body.o028},function(err,m028){
    if(m028)
      totaal += req.body.i028*m028.prijs;
  Materiaal.findOne({naam:req.body.o029},function(err,m029){
    if(m029)
      totaal += req.body.i029*m029.prijs;
  Materiaal.findOne({naam:req.body.o030},function(err,m030){
    if(m030)
      totaal += req.body.i030*m030.prijs;
  Materiaal.findOne({naam:req.body.o031},function(err,m031){
    if(m031)
      totaal += req.body.i031*m031.prijs;
  Materiaal.findOne({naam:req.body.o032},function(err,m032){
    if(m032)
      totaal += req.body.i032*m032.prijs;
  Materiaal.findOne({naam:req.body.o033},function(err,m033){
    if(m033)
      totaal += req.body.i033*m033.prijs;
  Materiaal.findOne({naam:req.body.o034},function(err,m034){
    if(m034)
      totaal += req.body.i034*m034.prijs;
  Materiaal.findOne({naam:req.body.o035},function(err,m035){
    if(m035)
      totaal += req.body.i035*m035.prijs;
  Materiaal.findOne({naam:req.body.o036},function(err,m036){
    if(m036)
      totaal += req.body.i036*m036.prijs;
  Materiaal.findOne({naam:req.body.o037},function(err,m037){
    if(m037)
      totaal += req.body.i037*m037.prijs;
  Materiaal.findOne({naam:req.body.o038},function(err,m038){
    if(m038)
      totaal += req.body.i038*m038.prijs;
  Materiaal.findOne({naam:req.body.o039},function(err,m039){
    if(m039)
      totaal += req.body.i039*m039.prijs;
  Materiaal.findOne({naam:req.body.o040},function(err,m040){
    if(m040)
      totaal += req.body.i040*m040.prijs;
  Materiaal.findOne({naam:req.body.o041},function(err,m041){
    if(m041)
      totaal += req.body.i041*m041.prijs;
  Materiaal.findOne({naam:req.body.o042},function(err,m042){
    if(m042)
      totaal += req.body.i042*m042.prijs;
  Materiaal.findOne({naam:req.body.o043},function(err,m043){
    if(m043)
      totaal += req.body.i043*m043.prijs;
  Materiaal.findOne({naam:req.body.o044},function(err,m044){
    if(m044)
      totaal += req.body.i044*m044.prijs;
  Materiaal.findOne({naam:req.body.o045},function(err,m045){
    if(m045)
      totaal += req.body.i045*m045.prijs;
  Materiaal.findOne({naam:req.body.o046},function(err,m046){
    if(m046)
      totaal += req.body.i046*m046.prijs;
  Materiaal.findOne({naam:req.body.o047},function(err,m047){
    if(m047)
      totaal += req.body.i047*m047.prijs;
  Materiaal.findOne({naam:req.body.o048},function(err,m048){
    if(m048)
      totaal += req.body.i048*m048.prijs;
  Materiaal.findOne({naam:req.body.o049},function(err,m049){
    if(m049)
      totaal += req.body.i049*m049.prijs;
  Materiaal.findOne({naam:req.body.o050},function(err,m050){
    if(m050)
      totaal += req.body.i050*m050.prijs;
    Settings.find({}, function(err, settings) {
      if (!err && settings.length != 0) {
        res.render('prijs-totaal',{"totaal":totaal.toFixed(2)+"€","description":"Berekenen van prijs","settings":settings[0]});
    }
    });
  });});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});});
});

app.post('/prijs/:totaal',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      var totaal_ = Number(req.params.totaal.substring(0, req.params.totaal.length - 1));
      var totaal = req.params.totaal;
      var marge = req.body.marge;
      res.render("prijs-totaal",{"totmarge":String(((totaal_*marge/100.0)+totaal_).toFixed(2))+"€","totaal":totaal,"settings":settings[0],'description':"berekening van marge"});
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
    }
  });
});

app.get('/mat',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      Materiaal.find({},function(err,materialen){
        if(!err){
          res.render('mat', {
            'materialen':materialen,
            'settings': settings[0],
            'description': "Alle materialen"
          });
        }else{console.log(err);}
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

app.get('/edit-mat/:id',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      Materiaal.findOne({_id:req.params.id},function(err,materiaal){
        console.log(materiaal);
        res.render('edit-mat', {
          'settings': settings[0],
          'materiaal':materiaal,
          'description': materiaal.naam +" aanpassen"
        });
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

app.post('/edit-mat/:id',function(req,res){
  var nieuwMat = {
    naam:req.body.naam,
    prijs:req.body.prijs
  };
  Materiaal.update({_id:req.params.id},nieuwMat,function(err,materiaal){
    if(!err){
      res.redirect('/mat');
    }else{console.log(err); }
  });
});

app.get('/add-mat',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('add-mat', {
        'settings': settings[0],
        'description': "Materiaal toevoegen"
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

app.post('/add-mat',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      var nieuwe_materiaal= new Materiaal({
        prijs:req.body.prijs,
        naam:req.body.naam
      });
      nieuwe_materiaal.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
      res.redirect('/mat');
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

app.get('/delete-mat/:id',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      Materiaal.remove({_id:req.params.id},function(err,mat){
        console.log("succesfully deleted material");
      });
      res.redirect('/mat');
    } else {
      legeSettings = new Settings();
      legeSettings.save(function(err) {
        if (err) {
          console.log("err in settings: " + err);
        }
      });
      console.log(legeSettings)   ;
      res.redirect('/settings');
      if (err) {
        console.log(err);
      }
    }
  });
});

app.get('/lam',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('lam', {
        'settings': settings[0],
        'description': "Berekening voor A1 Lamineren"
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

app.post('/lam-oplossing',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
        //Ingevulde variabelen
        var L = req.body.L;
        var B = req.body.B;
        var H = req.body.H
        var X = req.body.X;
        var M = req.body.M;
        var F = req.body.F;
        //Berekeningen
        var C = M*(F*1.75);
        var U = M*11;
        var G = U*P;
        var O = F*M;
        var E1 = C*7.20;
        var E2 = O*3.7;
        var E = E1+E2;
      res.render('lam-oplossing', {
        'settings': settings[0],
        'description': "Berekening voor A1 Lamineren",
        "L":L,"B":B,"H":H,"X":X,"M":M,"F":F,"C":C,"U":U,"G":G,"O":O,"E1":E1,"E2":E2,"E":E
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

app.get('/epo-sil',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('epo-sil', {
        'settings': settings[0],
        'description': "Berekening voor Epoxie & Siliconen"
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

app.post('/epo-sil-oplossing',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      var L = Number(req.body.L);
      console.log("L: "+L);
      var B = Number(req.body.B);
      console.log("B: "+B);
      var H = Number(req.body.H);
      console.log("H: "+H);
      var X = Number(req.body.X);
      console.log("X: "+X);
      var W = Number(req.body.W);
      console.log("W: "+W);
      //Siliconen
      var As = (L*B*H)*0.0185;
      console.log("As: "+As);
      var Dos = ( (L+X) * (B+X) * (H+X) ) * 0.0185;
      console.log("Dos: "+Dos);
      var Ds = Dos - As;
      console.log("Ds: "+Ds);
      var Ms = (1/2.23)*Ds;//Materiaal Uren siliconen
      console.log("Ms: "+Ms);
      var Pws = (W * Ms) //prijs werkuren voor siliconen
      console.log("Pws: "+Pws);
      var Ps =(13.5 * Ds); //Prijs siliconen
      console.log("Ps: "+Ps);
      //Epoxie
      var Ae = ((L+X)*(B+X)*(H+X))*0.018;
      console.log("Ae: "+Ae);
      var Doe = ((L+X+0.4)*(B+X+0.4)*(H+X+0.4))*0.018;
      console.log("Doe: "+Doe);
      var De = Doe - Ae;
      console.log("De: "+De);
      var Me = (1/3.50)*De;//Materiaal Uren epoxie
      console.log("Me: "+Me);
      var Pwe = (W * Me); //prijs werkuren epoxie
      console.log("Pwe: "+Pwe);
      var Pe = (10.88 * De);
      console.log("Pe: "+Pe);
      //TOTAAL
      var Ptw = Pwe + Pws;//Prijs totaal werkuren
      console.log("Ptw: "+Ptw);
      var Ptm = Pe + Ps //Prijs totaal materiaal
      console.log("Ptm: "+Ptm);
      var Pt = Ptw + Ptm; //Prijs totaal (werkuren + materiaal)
      console.log("Pt: "+Pt);
      var Mt = Me + Ms; //totaal uren voor alle materiaal
      console.log("Mt: "+Mt);
      res.render("epo-sil-oplossing",{"description":"Oplossing van berekening","settings":settings[0],
                              "L":L,"B":B,"H":H,"W":W,"Ds":De,"As":As,"Dos":Dos,"Ds":Ds,"Ms":Ms,"Ae":Ae,"Doe":Doe,"De":De,"Me":String(Me).toTime(),
                              "Ls":L+X,"Bs":B+X,"Hs":H+X,"Le":L+0.4+X,"Be":B+0.4+X,"He":H+0.4+X,"Ms":String(Ms).toTime(),"Pws":Pws,"Ps":Ps,"Pwe":Pwe,
                              "Ptw":Ptw,"Ptm":Ptm,"Pt":Pt,"Mt":String(Mt).toTime(),"Pe":Pe});
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

app.get('/inch',function(req,res){
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      res.render('inch', {
        'settings': settings[0],
        'description': "Berekening voor inch & cm omzettingen"
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

app.post('/inch',function(req,res){
  console.log("inch post")
  Settings.find({}, function(err, settings) {
    if (!err && settings.length != 0) {
      var inch = req.body.inch;
      var cm = req.body.cm;
      console.log("inch :"+inch);
      console.log("cm :"+cm);
      if(inch !== "" && cm !== ""){
        console.log("error allebei ingevuld");
        res.render('inch', {
          'settings': settings[0],
          'description': "Berekening voor inch & cm omzettingen",
          "error":1
        });
      }else{
        if(inch !==""){
          var cm = inch/0.39370;
          var cm_ = Number(cm).toFixed(2);
          var inch_ = Number(inch).toFixed(2);
          var oplossing = inch_+"\" = "+cm_+"cm";
          res.render('inch', {
            'settings': settings[0],
            'description': "Berekening voor inch & cm omzettingen",
            "oplossing":oplossing
          });
        }
        if(cm !== ""){
          var inch = cm*0.39370;
          var cm_ = Number(cm).toFixed(2);
          var inch_ = Number(inch).toFixed(2);
          var oplossing = cm_+"cm = "+inch_+"\"";
          res.render('inch', {
            'settings': settings[0],
            'description': "Berekening voor inch & cm omzettingen",
            "oplossing":oplossing
          });
        }
        console.log("error niets ingevuld");
        res.render('inch', {
          'settings': settings[0],
          'description': "Berekening voor inch & cm omzettingen",
          "error":2
        });
      }
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

function isNumeric(num){
  return !isNaN(num)
}
String.prototype.toTime = function () {
  var sec_num = parseInt(this*3600, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours + 'u ' + minutes + 'm';
 }
