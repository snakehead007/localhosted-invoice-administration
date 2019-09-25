//- V1.8

//Required npm packages
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var imageToBase64 = require('image-to-base64');

//Express initializing
var app = express();
app.locals.title = 'Simple-invoice-administrator';
app.locals.email = 'snakehead007@pm.me';

//Bodyparser initializing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Mongoose initializing
mongoose.connect('mongodb://localhost:27017/testing'); //This is still on 'sample-website'. After automatisating all Data import and export, then will be changed
mongoose.connection.on('open', function() {
  console.log('Mongoose connected!');
});

//Global variables initializing
var maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
var maand_klein = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
var month_small = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "oktober", "november", "december"];
var year = new Date().getFullYear().toString();

//Schema initializing
Schema = mongoose.Schema;
var SettingsSchema = new Schema({
  //Language of the user, can be "eng" or "nl"
  lang: {
    type: String,
    default: "nl"
  },
  //Theme of the user, currenlty working with bootstrap built-in themes
  thema: {
    type: String,
    default: "secondary"
  },
  //Theme opposite colour that suits the main chosen theme
  oppo: {
    type: String,
    default: "light"
  },
  //Navbars theme (This is only for the 'light' theme, otherwise it isnt readable)
  nav: {
    type: String,
    default: "dark"
  },
  s1: {
    type: Number,
    default: 0.039
  },
  s2: {
    type: Number,
    default: 0.0185
  },
  s3: {
    type: Number,
    default: 2.23
  },
  s4: {
    type: Number,
    default: 13.5
  },
  e1: {
    type: Number,
    default: 0.018
  },
  e2: {
    type: Number,
    default: 0.018
  },
  e3: {
    type: Number,
    default: 2
  },
  e4: {
    type: Number,
    default: 11
  },
  factuurtext: {
    type: String,
    default:""
  },
  creditnotatext:{
    type: String,
    default:""
  },
  offertetext:{
    type: String,
    default:""
  },
  pass:{
    type:String,
    default:"cGFzc3dvcmQ="
  },
  btw:{
    type:Number,
    default:21
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
  nrcred: {
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
});
var Bestelling = mongoose.model('Bestelling', BestellingSchema);
var FactuurSchema = new Schema({
  datum: {
    type: String
  },
  datumBetaald: {
    type: String
  },
  factuurNr: {
    type: Number
  },
  offerteNr: {
    type: Number
  },
  creditnr: {
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
    type: Number,
    default: 0
  }
});
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
  mail: {
    type: String
  },
  mail1: {
    type: String
  },
  mail2: {
    type: String
  },
  rekeningnr: {
    type: String
  }
});
var Contact = mongoose.model('Contact', ContactSchema);
var MateriaalSchema = new Schema({
  naam: {
    type: String
  },
  prijs: {
    type: Number,
    default: 0
  }
});
var Materiaal = mongoose.model('Materiaal', MateriaalSchema);
var ProjectSchema = new Schema({
  naam: {
    type: String
  },
  werkuren: {
    type: Number
  },
  werkprijs: {
    type: Number
  },
  aantallen: [{
    type: Number
  }],
  materialen: [{
    type: String
  }],
  contact: {
    type: Schema.Types.ObjectId,
    ref: 'Contact'
  }
});

app.get('/', function(req, res) {//REWORKED & tested
    //Check for first time use
    checkSettings().then(function(){
      checkProfile().then(function(){
        res.render('login');
      });
    });
});

app.get('/login', function(req, res) {//REWORKED & tested
  res.render('login');
});

app.get('/index/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
  if (String(req.params.loginHash) !== loginHash) {
    res.render('login');
  }
  });
    var fact_open = [];
    Profile.findOne({}, function(err,profile){
        if(!err){
            Settings.findOne({}, function(err, settings) {
                if (!err) {
                    Factuur.find({}, function (err, facturen) {
                        if (!err) {
                            var totaal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            for (var i = 0; i <= 11; i++) {
                                for (var factuur of facturen) {// TODO: 'for of' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).
                                    if (factuur.factuurNr) {
                                        if (factuur.datumBetaald) {
                                            if ((factuur.datumBetaald.includes(maand[i]) || factuur.datumBetaald.includes(maand_klein[i]) || factuur.datumBetaald.includes(month[i]) || factuur.datumBetaald.includes(month_small[i])) && factuur.datumBetaald.includes(year) && factuur.factuurNr && factuur.isBetaald) {
                                                totaal[i] += factuur.totaal;
                                            }
                                        } else if ((factuur.datum.includes(maand[i]) || factuur.datum.includes(maand_klein[i]) || factuur.datum.includes(month[i]) || factuur.datum.includes(month_small[i])) && factuur.datum.includes(year) && factuur.factuurNr && factuur.isBetaald) {
                                            totaal[i] += factuur.totaal;
                                        }
                                        if ((factuur.datum.includes(maand[i]) || factuur.datum.includes(maand_klein[i]) || factuur.datum.includes(month[i]) || factuur.datum.includes(month_small[i])) && !factuur.isBetaald){
                                          fact_open.push(factuur);
                                        }
                                    }
                                }
                            }
                                res.render(settings.lang+'/index', {
                                    "totaal": totaal,
                                    "description": "Grafiek",
                                    "settings": settings,
                                    "jaar": year,
                                    "loginHash": req.params.loginHash,
                                    "profile": profile,
                                    "facturenLijst":facturen,
                                    "fact_open":fact_open
                                });
                        }
                    });
                }
            });
        }
    });
});

app.post('/', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
  if ((enc(String(req.body.loginHash))) !== loginHash) {
      console.log(dec(loginHash));
    res.redirect('login');
  }});
    res.redirect('index/'+enc(req.body.loginHash));
});

app.get('/chart/:jaar/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Profile.findOne({},function(err,profile){
      Settings.findOne({}, function(err, settings) {
        if (!err) {
          Factuur.find({}, function(err, facturen) {
            if (!err) {
              var totaal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (var i = 0; i <= 11; i++) {
                for (var factuur of facturen) {// TODO: 'for of' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).
                  if (factuur.factuurNr) {
                    if (factuur.datumBetaald) {
                      if (  (factuur.datumBetaald.includes(maand[i]) || factuur.datumBetaald.includes(maand_klein[i]) || factuur.datumBetaald.includes(month[i]) || factuur.datumBetaald.includes(month_small[i])) && factuur.datumBetaald.includes(req.params.jaar) && factuur.factuurNr && factuur.isBetaald) {
                              totaal[i] += factuur.totaal;
                      }
                    } else if ( (factuur.datumBetaald.includes(maand[i]) || factuur.datumBetaald.includes(maand_klein[i]) || factuur.datumBetaald.includes(month[i]) || factuur.datumBetaald.includes(month_small[i])) && factuur.datum.includes(req.params.jaar) && factuur.factuurNr && factuur.isBetaald){
                        totaal[i] += factuur.totaal;
                      }
                  }
                  }
              }
                res.render(settings.lang+'/chart', {
                  "totaal": totaal,
                  "settings": settings,
                  "jaar": req.params.jaar,
                  "loginHash": req.params.loginHash,
                  "profile":profile
                });
            }
          });
        }
      });
    });
});

app.get('/contacten/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
      Profile.findOne({},function(err,profile){
        Contact.find({}, function(err, contacts) {
          Settings.findOne({}, function(err, settings) {
            if (!err ) {
              res.render(settings.lang+'/contacten', {
                'contactenLijst': contacts,
                "settings": settings,
                "loginHash": req.params.loginHash,
                  "profile":profile
              });
            }
          });
        });
      });
});

app.get('/delete-contact/:id/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.deleteOne({
      _id: req.params.id
    }, function(err) {
      if (!err) {
        Factuur.deleteOne({
          contact: req.params.id
        });
      }
    });
    Contact.find({}, function(err){
        if(!err) {
          res.redirect('/contacten/' + req.params.loginHash);
        }
    });
});

app.get('/add-contact/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({},function(err, settings) {
      Profile.findOne({},function(err,profile) {
        if (!err) {
            res.render(settings.lang+'/add/add-contact', {
              "settings": settings,
              "loginHash": req.params.loginHash,
              "profile":profile
            });
        }
      });
    });
});

app.post('/add-contact/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
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
      newContact.save();
          res.redirect('/contacten/'+req.params.loginHash);
    }

});

app.get('/edit-contact/:id/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({
      _id: req.params.id
    }, function(err, contacts) {
      Settings.findOne({}, function(err, settings) {
        if (!err) {
            Profile.findOne({}, function(err, profile) {
                if (!err) {
                    res.render(settings.lang+'/edit/edit-contact', {
                        'contact': contacts,
                        "profile": profile,
                        "settings": settings,
                        "loginHash": req.params.loginHash
                    });
                }
            });
        }
      });
    });

});

app.post('/edit-contact/:id/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
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
    Contact.update({
      _id: req.params.id
    }, updateData, function(err) {
      if (!err) {
        res.redirect('/contacten/'+ req.params.loginHash);
      }
    });

});

app.get('/view-contact/:idc/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({
      _id: req.params.idc
    }, function(err, contact) {
      if (!err) {
        Settings.findOne({}, function(err, settings) {
          if (!err) {
          Profile.findOne({}, function(err, profile) {
              if (!err) {
                  res.render(settings.lang+
                  '/view/view-contact', {
                      'contact': contact,
                      "profile": profile,
                      "settings": settings,
                      "loginHash": req.params.loginHash
                  });
              }
          });
          }
      });
    }
  });
});

app.get('/bestellingen/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          if (!err) {
            Bestelling.find({factuur: req.params.idf}, function(err, bestellingen) {
              if (!err) {
                Settings.findOne({}, function(err, settings) {
                  if (!err) {
                  Profile.findOne({}, function(err, profile) {
                      if (!err) {
                          res.render(settings.lang + '/bestellingen', {
                              'factuur': factuur,
                              'bestellingen': bestellingen,
                              "profile": profile,
                              "contact":contact,
                              "settings": settings,
                              "loginHash": req.params.loginHash
                          });
                      }
                  });
                  }
                });
              }
            });
          }
        });
      }
    });
});

app.get('/bestellingen/:idf/t/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          if (!err) {
            Bestelling.find({factuur: req.params.idf}, function(err, bestellingen) {
              if (!err) {
                Settings.findOne({}, function(err, settings) {
                  if (!err) {
                  Profile.findOne({}, function(err, profile) {
                      if (!err) {
                          res.render(settings.lang + '/bestellingen', {
                              'terug': 1,
                              'factuur': factuur,
                              'bestellingen': bestellingen,
                              "profile": profile,
                              "contact":contact,
                              "settings": settings,
                              "loginHash": req.params.loginHash
                          });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
});

app.post('/add-bestelling/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
        var newBestelling = new Bestelling({
          beschrijving: req.body.beschrijving,
          aantal: req.body.aantal,
          bedrag: req.body.bedrag,
          factuur: req.params.idf,
          totaal: req.body.aantal * req.body.bedrag
        });
        newBestelling.save();
        Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
          if (!err) {
            var totFac = ((((factuur.totaal + factuur.voorschot) + (req.body.aantal * req.body.bedrag)) - factuur.voorschot));
            Factuur.updateOne({_id: req.params.idf}, {totaal:totFac},function(){
              res.redirect('/bestellingen/' + req.params.idf + "/" + req.params.loginHash);
            });
          }
        });
});

app.get('/add-bestelling/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
          Contact.findOne({_id:factuur.contact},function(err,contact){
              if(!err){
        Settings.findOne({}, function(err, settings) {
          if (!err) {
          Profile.findOne({}, function(err, profile) {
              if (!err) {
                  res.render(settings.lang+'/add/add-bestelling', {
                      'factuur': factuur,
                      "profile":profile,
                      "settings": settings,
                      "loginHash": req.params.loginHash,
                      "contact":contact
                  });
              }
            });
          }
        });
      }
      });
      }
    });
});

app.get('/edit-bestelling/:id/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Bestelling.findOne({_id: req.params.id}, function(err, bestelling) {
      Factuur.findOne({_id: bestelling.factuur}, function(err, factuur) {
        Settings.findOne({}, function(err, settings) {
        Profile.findOne({}, function(err, profile) {
            if (!err) {
                res.render(settings.lang+'/edit/edit-bestelling', {
                    'bestelling': bestelling,
                    "factuur": factuur,
                    "profile":profile,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                });
            }
        });
        });
      });
    });
});

app.post('/edit-bestelling/:id/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Bestelling.findOne({_id: req.params.id}, function(err, bestelling) {
    var updateBestelling = {
      beschrijving: req.body.beschrijving,
      aantal: req.body.aantal,
      bedrag: req.body.bedrag,
      totaal: req.body.aantal * req.body.bedrag,
    };
    Factuur.findOne({_id: bestelling.factuur}, function(err, factuur) {
      Bestelling.updateOne({_id: req.params.id}, updateBestelling);
        var tot = factuur.totaal - (bestelling.aantal * bestelling.bedrag);
        var newFactuur = {totaal: ((tot + (req.body.aantal * req.body.bedrag) - factuur.voorschot))};
        Factuur.updateOne({_id: bestelling.factuur}, newFactuur, function(err) {
          if (!err) {
            res.redirect('/bestellingen/' + bestelling.factuur + "/" + req.params.loginHash);
          }
        });
    });
  });
});

app.get('/delete-bestelling/:idb/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Bestelling.findOne({_id: req.params.idb}, function(err, bestelling) {
      Factuur.findOne({_id: bestelling.factuur}, function(err, factuur) {
        Bestelling.deleteOne({_id: req.params.idb}, function(err) {
          if (!err) {
            var newFactuur = {totaal: factuur.totaal - (bestelling.aantal * bestelling.bedrag)};
            Factuur.updateOne({_id: factuur._id}, newFactuur, function(err){
                if(!err)
                  res.redirect('/bestellingen/' + factuur._id + "/" + req.params.loginHash);
            });
          }
        });
      });
    });
});

app.get('/view-bestelling/:idb/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Bestelling.findOne({_id: req.params.idb}, function(err, bestelling) {
      if (!err) {
        Factuur.findOne({_id: bestelling.factuur}, function(err, factuur) {
          if (!err) {
            Settings.findOne({}, function(err, settings) {
              if (!err) {

                Profile.findOne({}, function(err, profile) {
                  if (!err) {
                    res.render(settings.lang + '/view/view-bestelling', {
                      'bestelling': bestelling,
                      "factuur": factuur,
                      "profile": profile,
                      "settings": settings,
                      "loginHash": req.params.loginHash
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
});

app.get('/facturen/:idc/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Contact.findOne({_id: req.params.idc}, function(err, contact) {
    if (!err) {
      Factuur.find({contact: req.params.idc}).sort('-factuurNr').exec(function(err, facturen) {
        if (!err) {
          Settings.findOne({}, function(err, settings) {
              Profile.findOne({},function(err,profile){
                if (!err) {
                  res.render(settings.lang+'/facturen', {
                    'contact': contact,
                    'facturenLijst': facturen,
                    "settings": settings,
                    "loginHash": req.params.loginHash,
                      "profile":profile
                  });
                }
              });
          });
        }
      });
    }
  });
});

app.get('/add-factuur/:loginHash',function(req,res){
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({},function(err,settings){
    if(!err){
      Profile.findOne({},function(err,profile){
        if(!err){
          Contact.find({},function(err,contacten) {
            if(!err){
              res.render(settings.lang + '/add-file-no-contact', {
                "profile": profile,
                "settings": settings,
                "loginHash": req.params.loginHash,
                "add": "factuur",
                "contacten":contacten
              });
            }
          });
        }
      });
    }
  });
});

app.get('/add-offerte/:loginHash',function(req,res){
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({},function(err,settings){
    if(!err){
      Profile.findOne({},function(err,profile){
        if(!err){
          Contact.find({},function(err,contacten) {
            if(!err){
              res.render(settings.lang + '/add-file-no-contact', {
                "profile": profile,
                "settings": settings,
                "loginHash": req.params.loginHash,
                "add": "offerte",
                "contacten":contacten
              });
            }
          });
        }
      });
    }
  });
});

app.get('/add-creditnota/:loginHash',function(req,res){
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({},function(err,settings){
    if(!err){
      Profile.findOne({},function(err,profile){
        if(!err){
          Contact.find({},function(err,contacten) {
            if(!err){
              res.render(settings.lang + '/add-file-no-contact', {
                "profile": profile,
                "settings": settings,
                "loginHash": req.params.loginHash,
                "add": "creditnota",
                "contacten":contacten
              });
            }
          });
        }
      });
    }
  });
});

app.post('/add-factuur/:loginHash', function(req, res) {//REWORKED & tested
    callFindPass().then(function(loginHash){
        if (String(req.params.loginHash) !== loginHash) {
            res.render('login');
        }});
    Settings.findOne({}, function(err, settings) {
        Contact.findOne({_id: req.body.idc}, function(err, contact) {
            if (!err) {
                contact.save(function(err) {
                    if (!err) {
                        Profile.findOne({}, function(err, prof) {
                            prof.save(function(err) {
                                if(err){console.log('err: '+err);}
                                Profile.updateOne({nr: prof.nr + 1}, function(err) {
                                    if(err){console.log('err: '+err);}
                                    var factuurNr;
                                    if (prof.nr.toString().length == 1) {
                                        factuurNr = "00" + prof.nr.toString();
                                    } else if (prof.nr.toString().length == 2) {
                                        factuurNr = "0" + prof.nr.toString();
                                    }
                                    var newFactuur = new Factuur({
                                        contact: contact._id,
                                        datum: getDatum(settings.lang),
                                        factuurNr: String(year + factuurNr),
                                        contactPersoon: contact.contactPersoon,
                                        totaal: 0,
                                        datumBetaald: getDatum(settings.lang)
                                    });
                                    Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                                        if(!err){
                                            contact.facturen.push(newFactuur._id);
                                        }
                                    });
                                    newFactuur.save(function(err){
                                        if(!err){
                                            res.redirect('/facturen/' + req.params.loginHash);
                                        }
                                    });
                                });
                            });
                        });
                    }
                });
            }
        });
    });
});

app.get('/facturen/:idc/t/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      if (!err) {
        Factuur.find({contact: req.params.idc}).sort('-factuurNr').exec(function(err, facturen) {
          if (!err) {
            Settings.findOne({}, function(err, settings) {
              Profile.findOne({},function(err,profile) {
                if (!err) {
                  res.render(settings.lang+'/facturen', {
                    'terug': 1,
                    'contact': contact,
                    'facturenLijst': facturen,
                    "profile":profile,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });
                }
              });
            });
          }
        });
      }
    });
});

app.get('/facturen/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.find({}).sort('-factuurNr').exec(function(err, facturen) {
      if (!err) {
        Settings.findOne({}, function(err, settings) {
          if (!err) {
              Profile.findOne({},function(err,profile){
                if(settings.lang=="nl"){
                res.render('nl/facturen', {
                  'facturenLijst': facturen,
                  'description': "Alle facturen",
                  "settings": settings,
                  "loginHash": req.params.loginHash,
                    "profile":profile
                });}else{
                  res.render('eng/facturen', {
                    'facturenLijst': facturen,
                    'description': "All invoices",
                    "settings": settings,
                    "loginHash": req.params.loginHash,
                      "profile":profile
                  });
                }
              });
          }
        });
      }
    });
});

app.get('/add-factuur/:idc/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      if (!err) {
        contact.save(function(err) {
          if (!err) {
            Profile.findOne({}, function(err, prof) {
              prof.save(function(err) {
              if(err){console.log('err: '+err);}
                Profile.updateOne({nr: prof.nr + 1}, function(err) {
                    if(err){console.log('err: '+err);}
                    var factuurNr;
                    if (prof.nr.toString().length == 1) {
                      factuurNr = "00" + prof.nr.toString();
                    } else if (prof.nr.toString().length == 2) {
                      factuurNr = "0" + prof.nr.toString();
                    }
                    var newFactuur = new Factuur({
                      contact: contact._id,
                      datum: getDatum(settings.lang),
                      factuurNr: String(year + factuurNr),
                      contactPersoon: contact.contactPersoon,
                      totaal: 0,
                      datumBetaald: getDatum(settings.lang)
                    });
                    Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                      if(!err){
                        contact.facturen.push(newFactuur._id);
                      }
                    });
                    newFactuur.save(function(err){
                      if(!err){
                        res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
                      }
                    });
                  });
                });
            });
          }
        });
      }
    });
  });
});

app.get('/delete-factuur/:idc/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      Factuur.deleteOne({_id: req.params.idf}, function(err) {
        if (!err) {
          Factuur.find({contact: req.params.idc}, function(err, facturen) {
            if (!err) {
              Settings.findOne({}, function(err, settings) {
                if (!err) {
                  if(settings.lang=="nl"){
                  res.render('nl/facturen', {
                    'contact': contact,
                    'facturenLijst': facturen,
                    'description': "Facturen van " + contact.contactPersoon,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });}else{
                    res.render('eng/facturen', {
                      'contact': contact,
                      'facturenLijst': facturen,
                      'description': "Invoices of " + contact.contactPersoon,
                      "settings": settings,
                      "loginHash": req.params.loginHash
                    });
                  }
                }
              });
            }
          });
        }
      });
    });
});

app.get('/delete-factuur/:idc/:idf/t/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
      Factuur.deleteOne({_id: req.params.idf}, function(err) {
        if (!err) {
          Factuur.find({}, function(err, facturen) {
            if (!err) {
              Settings.findOne({}, function(err, settings) {
                if (!err) {
                  if(settings.lang=="nl"){
                  res.render('nl/facturen', {
                    'facturenLijst': facturen,
                    'description': 'Alle facturen',
                    'settings': settings,
                    "loginHash": req.params.loginHash
                  }); }else{
                    res.render('eng/facturen', {
                      'facturenLijst': facturen,
                      'description': 'All invoices',
                      'settings': settings,
                      "loginHash": req.params.loginHash
                    });
                  }
                }
              });
            }
          });
        }
      });
});

app.get('/edit-factuur/:idc/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
        if (!err) {
          Settings.findOne({}, function(err, settings) {
            if (!err) {
                Profile.findOne({}, function(err, profile) {
                    if (!err) {
                        res.render(settings.lang + '/edit/edit-factuur', {
                            'factuur': factuur,
                            'contact': contact,
                            "profile": profile,
                            "settings": settings,
                            "loginHash": req.params.loginHash
                        });
                    }
                });
            }
          });
        }
      });
    });
});

app.get('/edit-factuur/:idc/:idf/t/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
        if (!err) {
          Settings.findOne({}, function(err, settings) {
            if (!err) {
                Profile.findOne({}, function(err, profile) {
                    if (!err) {
                      res.render(settings.lang + '/edit/edit-factuur', {
                        'terug': 1,
                        'factuur': factuur,
                        'contact': contact,
                        "profile": profile,
                        "settings": settings,
                        "loginHash": req.params.loginHash
                      });
                    }
                    });
                }
          });
        }
      });
    });
});

app.get('/updateFactuur/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          Settings.findOne({}, function(err, settings) {
            if (!err) {
              var updateFactuur = {
                contactPersoon: contact.contactPersoon
              };
              Factuur.updateOne({_id: req.params.idf}, updateFactuur, function(err) {
              if(err){console.log('err: '+err);}
                Factuur.find({}, function(err, facturen) {
                  if(settings.lang=="nl"){
                  res.render('nl/facturen', {
                    'facturenLijst': facturen,
                    'description': "Alle facturen",
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });}else{
                    res.render('nl/facturen', {
                      'facturenLijst': facturen,
                      'description': "All invoices",
                      "settings": settings,
                      "loginHash": req.params.loginHash
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
});

app.post('/edit-factuur/:idc/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
      Bestelling.find({
        factuur: req.params.idf
      }, function(err, bestellingen) {
          var totBes = 0;
          for (var i = 0; i <= bestellingen.length - 1; i++) {
            totBes += bestellingen[i].totaal;
          }
          var updateFactuur;
          if (req.body.voorschot) {
            updateFactuur = {
              datum: req.body.datum,
              factuurNr: req.body.factuurNr,
              voorschot: req.body.voorschot,
              offerteNr: req.body.offerteNr,
              datumBetaald: req.body.datumBetaald,
              totaal: totBes - req.body.voorschot
            };
          } else {
            updateFactuur = {
              datum: req.body.datum,
              factuurNr: req.body.factuurNr,
              voorschot: req.body.voorschot,
              offerteNr: req.body.offerteNr,
              datumBetaald: req.body.datumBetaald,
              totaal:totBes
            };
          }
          Contact.findOne({_id: req.params.idc}, function(err, contact) {
            Factuur.updateOne({_id: req.params.idf}, updateFactuur, function(err) {
              if (!err) {
                res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
              }
            });
          });
      });
});

app.post('/edit-factuur/:idc/:idf/t/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Bestelling.find({factuur: req.params.idf}, function(err, bestellingen) {
        var totBes = 0;
        for (var i = 0; i <= bestellingen.length - 1; i++) {
          totBes += bestellingen[i].totaal;
        }
        var updateFactuur;
        if (req.body.voorschot) {
          updateFactuur = {
            datum: req.body.datum,
            factuurNr: req.body.factuurNr,
            voorschot: req.body.voorschot,
            offerteNr: req.body.offerteNr,
            datumBetaald: req.body.datumBetaald,
            totaal: totBes - req.body.voorschot
          };
        } else {
          updateFactuur = {
            datum: req.body.datum,
            factuurNr: req.body.factuurNr,
            voorschot: req.body.voorschot,
            offerteNr: req.body.offerteNr,
            datumBetaald: req.body.datumBetaald
          };
        }

        Contact.findOne({_id: req.params.idc}, function(err) {
        if(err){console.log('err: '+err);}
          Factuur.updateOne({_id: req.params.idf}, updateFactuur, function(err) {
              if(err){console.log('err: '+err);}
              res.redirect('/facturen/' + req.params.loginHash);
          });
        });
    });
});

app.get('/view-factuur/:idf/:loginHash', function(req, res) {//REWORKED & tested
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          Settings.findOne({}, function(err, settings) {
            if(!err){
              Profile.findOne({}, function(err, profile) {
                if (!err) {
                  res.render(settings.lang +'/view/view-factuur', {
                    'factuur': factuur,
                    'contact': contact,
                    "profile": profile,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });
                }
              });
            }
          });
        });
      }
    });
});

app.get('/view-factuur/:idf/t/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
      if (!err) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          Settings.findOne({}, function(err, settings) {
            if (!err){
              Profile.findOne({}, function(err, profile) {
                if (!err) {
                  res.render(settings.lang + '/view/view-factuur', {
                    'terug': 1,
                    'factuur': factuur,
                    'contact': contact,
                    "profile":profile,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });
                }
                });
            }
          });
        });
      }
    });
});

app.get('/createPDF/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Profile.findOne({}, function(err, profile) {
      Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
        Contact.findOne({_id: factuur.contact}, function(err, contact) {
          Bestelling.find({factuur: factuur._id}, function(err, bestellingen) {
            Settings.findOne({}, function(err, settings) {
              if (!err){
                callGetBase64().then(function(imgData){
                    res.render(settings.lang+'/pdf/pdf', {
                      'profile': profile,
                      'contact': contact,
                      'bestellingen': createJSON(bestellingen),
                      "factuur": factuur,
                      'lengte': bestellingen.length,
                      "settings": settings,
                      "loginHash": req.params.loginHash,
                      "factuurtext": replaceAll(settings.factuurtext,profile,contact,factuur,settings.lang),
                      "imgData":imgData,
                      "btw":settings.btw
                    });
                });
              }
            });
          });
        });
      });
    });
});

app.get('/edit-profile/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    var date = new Date();
    var _jaar = date.getFullYear();
    var jaar = _jaar.toString();
    Profile.findOne({}, function(err, profile) {
      if (!err) {
        var _nr = profile.nr;
        var nr_str = _nr.toString();
        if (nr_str.toString().length == 1) {
          nr_str = "00" + _nr.toString();
        } else if (nr_str.toString().length == 2) {
          nr_str = "0" + _nr.toString();
        }
        var _nroff = profile.nroff;
        var nroff_str = _nroff.toString();
        if (nroff_str.toString().length == 1) {
          nroff_str = "00" + _nroff.toString();
        } else if (nroff_str.toString().length == 2) {
          nroff_str = "0" + _nroff.toString();
        }
        var _nrcred = profile.nrcred;
        var nrcred_str = _nrcred.toString();
        if (nrcred_str.toString().length == 1) {
          nrcred_str = "00" + _nrcred.toString();
        } else if (nrcred_str.toString().length == 2) {
          nrcred_str = "0" + _ncred.toString();
        }
        Settings.findOne({}, function(err, settings) {
          if (!err) {
          Profile.findOne({}, function(err, profile) {
              if (!err) {
                  res.render(settings.lang+'/edit/edit-profile', {
                      'profile': profile,
                      'nroff': Number(jaar + nroff_str),
                      'nr': Number(jaar + nr_str),
                      'nrcred': Number(jaar + nrcred_str),
                      "profile":profile,
                      "settings": settings,
                      "loginHash": req.params.loginHash
                  });
              }
              });
          }
        });
      }
    });
});

app.post('/edit-profile/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
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
      nr: Number(req.body.nr.toString().substring(req.body.nr.toString().length - 3)),
      nroff: Number(req.body.nroff.toString().substring(req.body.nroff.toString().length - 3)),
      nrcred: Number(req.body.nrcred.toString().substring(req.body.nrcred.toString().length - 3)),
      tele: req.body.tele,
      mail: req.body.mail
    };
    Profile.update({_id: req.params.id}, updateProfile, function(err) {
      if (!err) {
        res.redirect('/index/' + req.params.loginHash);
      }
    });
});

app.get('/offerte/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Profile.findOne({}, function(err, profile) {
      Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
        Contact.findOne({_id: factuur.contact}, function(err2, contact) {
          Bestelling.find({factuur: factuur._id}, function(err3, bestellingen) {
            Settings.findOne({}, function(err, settings) {
                callGetBase64().then(function(imgData){
                var json_data = createJSON(bestellingen);
                if(settings.lang=="nl"){
                res.render('nl/pdf/offerte', {
                  'profile': profile,
                  'contact': contact,
                  'bestellingen': createJSON(bestellingen),
                  "factuur": factuur,
                  'lengte': lengte,
                  "settings": settings,
                  "loginHash": req.params.loginHash,
                  "offertetext":replaceAll(settings.offertetext,profile,contact,factuur,settings.lang),
                  "imgData":imgData,
                  "btw":settings.btw
                });}else{
                  res.render('eng/pdf/offerte', {
                    'profile': profile,
                    'contact': contact,
                    'bestellingen': json_data,
                    "factuur": factuur,
                    'lengte': lengte,
                    "settings": settings,
                    "loginHash": req.params.loginHash,
                    "offertetext":replaceAll(settings.offertetext,profile,contact,factuur,settings.lang),
                    "imgData":imgData,
                    "btw":settings.btw
                  });
                }
              });
            });
          });
        });
      });
    });

});

app.post('/add-offerte/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Contact.findOne({_id: req.body.idc}, function(err, contact) {
      if (!err) {
        contact.save(function(err) {
          if(err){console.log('err: '+err);}
          Profile.findOne({}, function(err, profile) {
            if (!err) {
              profile.save(function(err) {
                if (!err) {
                  Profile.updateOne({nroff: profile.nroff + 1}, function(err) {
                    if (!err) {
                      var nr_str;
                      if (profile.nroff.toString().length == 1) {
                        nr_str = "00" + profile.nroff.toString();
                      } else if (profile.nroff.toString().length == 2) {
                        nr_str = "0" + profile.nroff.toString();
                      }
                      var newFactuur = new Factuur({
                        contact: contact._id,
                        datum: getDatum(settings.lang),
                        offerteNr: String(year + nr_str),
                        contactPersoon: contact.contactPersoon
                      });
                      Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                        if(err){console.log('err: '+err);}
                        contact.facturen.push(newFactuur._id);
                      });
                      newFactuur.save();
                      if (!err) {
                        res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
                      }
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  });
});

app.get('/add-offerte/:idc/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      if (!err) {
        contact.save(function(err) {
        if(err){console.log('err: '+err);}
          Profile.findOne({}, function(err, profile) {
            if (!err) {
              profile.save(function(err) {
                if (!err) {
                  Profile.updateOne({nroff: profile.nroff + 1}, function(err) {
                    if (!err) {
                      var nr_str;
                      if (profile.nroff.toString().length == 1) {
                        nr_str = "00" + profile.nroff.toString();
                      } else if (profile.nroff.toString().length == 2) {
                        nr_str = "0" + profile.nroff.toString();
                      }
                      var newFactuur = new Factuur({
                        contact: contact._id,
                        datum: getDatum(settings.lang),
                        offerteNr: String(year + nr_str),
                        contactPersoon: contact.contactPersoon
                      });
                      Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                          if(err){console.log('err: '+err);}
                          contact.facturen.push(newFactuur._id);
                        });
                      newFactuur.save();
                        if (!err) {
                          res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
                        }
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  });
});

app.get('/creditnota/:idc/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Profile.findOne({}, function(err, profile) {
      Factuur.findOne({_id: req.params.idc}, function(err, factuur) {
        if (!err){
          Contact.findOne({_id: factuur.contact}, function(err, contact) {
            Bestelling.find({factuur: factuur._id}, function(err, bestellingen) {
              Settings.findOne({}, function(err, settings) {
                  callGetBase64().then(function(imgData){
                  if(settings.lang=="nl"){
                  res.render('nl/pdf/creditnota', {
                    'profile': profile,
                    'contact': contact,
                    'bestellingen':  createJSON(bestellingen),
                    "factuur": factuur,
                    'lengte': lengte,
                    "settings": settings,
                    "loginHash": req.params.loginHash,
                    "creditnotatext":replaceAll(settings.creditnotatext,profile,contact,factuur,settings.lang),
                    "imgData":imgData,
                    "btw":settings.btw
                  });}else{
                    res.render('eng/pdf/creditnota', {
                      'profile': profile,
                      'contact': contact,
                      'bestellingen':  createJSON(bestellingen),
                      "factuur": factuur,
                      'lengte': lengte,
                      "settings": settings,
                      "loginHash": req.params.loginHash,
                      "creditnotatext":replaceAll(settings.creditnotatext,profile,contact,factuur,settings.lang),
                      "imgData":imgData,
                      "btw":settings.btw
                    });
                  }
                });
              });
            });
          });
        }
      });
    });
});

app.post('/add-creditnota/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Contact.findOne({_id: req.body.idc}, function(err, contact) {
      if (!err) {
        contact.save(function(err) {
          if (!err) {
            Profile.findOne({}, function(err, profile) {
              profile.save(function(err) {
                if(err){console.log('err: '+err);}
                Profile.updateOne({nrcred: profile.nrcred + 1}, function(err) {
                  if (!err){
                    var nr_str;
                    if (profile.nrcred.toString().length == 1) {
                      nr_str = "00" + profile.nrcred.toString();
                    } else if (profile.nrcred.toString().length == 2) {
                      nr_str = "0" + profile.nrcred.toString();
                    }
                    var newFactuur = new Factuur({
                      contact: contact._id,
                      datum: getDatum(settings.lang),
                      creditnr: String(year + nr_str),
                      contactPersoon: contact.contactPersoon,
                      totaal: 0,
                    });
                    Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                      if(err){console.log('err: '+err);}
                      contact.facturen.push(newFactuur._id);
                    });
                    newFactuur.save();
                    res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
                  }
                });
              });
            });
          }
        });
      }
    });
  });
});

app.get('/add-creditnota/:idc/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      if (!err) {
        contact.save(function(err) {
          if (!err) {
            Profile.findOne({}, function(err, profile) {
              profile.save(function(err) {
              if(err){console.log('err: '+err);}
                Profile.updateOne({nrcred: profile.nrcred + 1}, function(err) {
                  if (!err){
                    var nr_str;
                    if (profile.nrcred.toString().length == 1) {
                      nr_str = "00" + profile.nrcred.toString();
                    } else if (profile.nrcred.toString().length == 2) {
                      nr_str = "0" + profile.nrcred.toString();
                    }
                    var newFactuur = new Factuur({
                      contact: contact._id,
                      datum: getDatum(settings.lang),
                      creditnr: String(year + nr_str),
                      contactPersoon: contact.contactPersoon,
                      totaal: 0,
                    });
                    Contact.updateOne({aantalFacturen: contact.aantalFacturen + 1}, function(err) {
                        if(err){console.log('err: '+err);}
                        contact.facturen.push(newFactuur._id);
                    });
                    newFactuur.save();
                    res.redirect('/facturen/' + contact._id + "/" + req.params.loginHash);
                  }
                });
              });
            });
          }
        });
      }
    });
  });
});

app.get('/view-creditnota/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});

  Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
    if (!err) {
      Contact.findOne({_id: factuur.contact}, function(err, contact) {
        Settings.findOne({}, function(err, settings) {
          if (!err){
            if(settings.lang=="nl"){
                res.render('nl/view/view-ceditnota', {
                  'factuur': factuur,
                  'contact': contact,
                  "description": "Bekijk creditnota van " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
                  "settings": settings,
                  "loginHash":req.params.loginHash
                });}else{
                res.render('nl/view/view-ceditnota', {
                  'factuur': factuur,
                  'contact': contact,
                  "description": "View creditnote of " + contact.contactPersoon + " (" + factuur.factuurNr + ")",
                  "settings": settings,
                  "loginHash":req.params.loginHash
                });
              }
          }
        });
      });
    }
  });
});

app.get('/view-creditnota/:idf/t/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
    if (!err) {
      Contact.findOne({_id: factuur.contact}, function(err, contact) {
        Settings.findOne({}, function(err, settings) {
          if (!err){
            Profile.findOne({}, function(err, profile) {
              if (!err) {
                res.render(settings.lang + '/view/view-factuur', {
                  'terug': 1,
                  'factuur': factuur,
                  'contact': contact,
                  "profile":profile,
                  "settings": settings,
                  "loginHash": req.params.loginHash
                });
              }
          });
        }
        });
      });
    }
  });
});

app.get('/opwaardeer/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});

    Settings.findOne({}, function(err, settings) {
        Profile.findOne({}, function(err, profile) {
          if (!err) {
            profile.save(function(err) {
                if(err){console.log('err: '+err);}
                Profile.updateOne({nr: profile.nr + 1}, function(err) {
                if(err){console.log('err: '+err);}
                var nr_str;
                if (profile.nr.toString().length == 1) {
                  nr_str = "00" + profile.nr.toString();
                } else if (nr_str.toString().length == 2) {
                  nr_str = "0" + profile.nr.toString();
                }
                var updateFactuur = {
                  datum: getDatum(settings.lang),
                  factuurNr: String(year + nr_str)
                };
                Factuur.update({_id: req.params.idf}, updateFactuur, function(err) {
                if(err){console.log('err: '+err);}
                  res.redirect('/facturen/' + factuur.contact + "/" + req.params.loginHash);
                });
              });
            });
          }
        });
  });
});

app.get('/opwaardeer/:idf/t/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
        Profile.findOne({}, function(err, profile) {
          if (!err) {
            profile.save(function(err) {
              if(err){console.log('err: '+err);}
              Profile.updateOne({nr: profile.nr + 1}, function(err) {
                if(err){console.log('err: '+err);}
                var nr_str = profile.nr.toString();
                if (nr_str.toString().length == 1) {
                  nr_str = "00" + profile.nr.toString();
                } else if (nr_str.toString().length == 2) {
                  nr_str = "0" + profile.nr.toString();
                }
                var updateFactuur = {
                  datum: getDatum(settings.lang),
                  factuurNr: String(jaar + nr_str)
                };
                Factuur.update({_id: req.params.idf}, updateFactuur, function(err) {
                if(err){console.log('err: '+err);}
                  res.redirect('/facturen/' + req.params.loginHash);
                });
              });
            });
          }
        });
  });
});

app.get('/delete-creditnota/:idc/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      Factuur.deleteOne({_id: req.params.idf}, function(err) {
        if (!err) {
          Factuur.find({contact: req.params.idc}, function(err, facturen) {
            if (!err) {
              Settings.findOne({}, function(err, settings) {
                if (!err){if(settings.lang=="nl"){
                  res.render('nl/facturen', {
                    'contact': contact,
                    'facturenLijst': facturen,
                    'description': "Facturen van " + contact.contactPersoon,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                });}else{
                  res.render('eng/facturen', {
                    'contact': contact,
                    'facturenLijst': facturen,
                    'description': "Invoices of " + contact.contactPersoon,
                    "settings": settings,
                    "loginHash": req.params.loginHash
                  });
                }
              }
            });
            }
          });
        }
      });
    });
});

app.get('/edit-creditnota/:idc/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Contact.findOne({_id: req.params.idc}, function(err, contact) {
      Factuur.findOne({_id: req.params.idf}, function(err, factuur) {
        if (!err) {
          Settings.findOne({}, function(err, settings) {
            if (!err){
                Profile.findOne({}, function(err, profile) {
                    if (!err) {
                        res.render(settings.lang+'/edit/edit-creditnota', {
                            'factuur': factuur,
                            'contact': contact,
                            "proile":profile,
                            "settings": settings,
                            "loginHash": req.params.loginHash
                        });
                    }
                });
            }
          });
        }
      });
    });
});

app.post('/zoeken/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  console.log("[I]: "+req.body.search);
    var str = req.body.search.toString().toLowerCase();
    var contacten = [];
    var facturen = [];
    var bestellingen = [];
    var materialen = [];
    Contact.find({}, function(err, contacten_) {
        Factuur.find({}, function(err, facturen_) {
            Bestelling.find({}, function(err, bestellingen_) {
              Materiaal.find({},function(err, mats_){
                //BESTELLINGEN
                for (var bestelling of bestellingen_) {
                  if (String(bestelling.beschrijving).toLowerCase().includes(str)) {
                    bestellingen.push(bestelling);
                  }
                }
                //Facturen
                for (var factuur of facturen_) {
                  if (isNumeric(str)) {
                    if (String(factuur.factuurNr).includes(str)) {
                      facturen.push(factuur);
                    } else if (String(factuur.offerteNr).includes(str)) {
                      facturen.push(factuur);
                    }
                  }
                }
                //Contacten
                for (var contact of contacten_) {
                  if (String(contact.contactPersoon).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.postcode).includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.plaats).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.mail).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.mail2).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.mail3).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.firma).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                  if (String(contact.straat).toLowerCase().includes(str)) {
                    contacten.push(contact);
                  }
                }
              //Matterialen
                  if(!mats_.length == 0){
                      for (var mat of mats_){
                          var _mat = String(mat.naam).toLowerCase();
                        if(_mat.includes(str)){
                          materialen.push(mat);
                        }
                      }
                  }
                //takes only 1 of each items, if found 2 or more of the same
                var contacten_d = distinct(contacten);
                var bestellingen_d = distinct(bestellingen);
                var facturen_d = distinct(facturen);
                var materialen_d = distinct(materialen);
                Settings.findOne({}, function(err, settings) {
                  if (!err) {
                    Profile.findOne({}, function (err, profile) {
                      if (!err) {
                        res.render(settings.lang + '/zoeken', {
                          "description": "Zoeken op \"" + str + "\"",
                          "settings": settings,
                          "contacten_d": contacten_d,
                          "bestellingen_d": bestellingen_d,
                          "facturen_d": facturen_d,
                          "materialen_d": materialen_d,
                          "loginHash": req.params.loginHash,
                          "profile": profile
                        });
                      }
                    });
                  }
                  });
              });
          });
      });
  });
});

app.post('/edit-creditnota/:idc/:idf/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Bestelling.find({factuur: req.params.idf}, function(err, bestellingen) {
      var totBes = 0;
      for (var i = 0; i <= bestellingen.length - 1; i++) {
        totBes += bestellingen[i].totaal;
      }
      var _t;
      if (req.body.voorschot) {
        _t = totBes - req.body.voorschot;
      } else {
        _t = totBes;
      }
      var updateFactuur;
      if (req.body.voorschot !== "") {
        updateFactuur = {
          datum: req.body.datum,
          factuurNr: req.body.factuurNr,
          creditnr: req.body.creditnr,
          voorschot: req.body.voorschot,
          offerteNr: req.body.offerteNr,
          totaal: _t
        };
      } else {
        updateFactuur = {
          datum: req.body.datum,
          factuurNr: req.body.factuurNr,
          voorschot: req.body.voorschot,
          creditnr: req.body.creditnr,
          offerteNr: req.body.offerteNr
        };
      }
      Contact.findOne({_id: req.params.idc}, function(err, contact) {
        Factuur.update({_id: req.params.idf}, updateFactuur, function(err) {
          if (!err) {
            res.redirect('/facturen/' + contact._id+ "/"+req.params.loginHash);
          }
        });
      });
  });
});

app.post('/edit-creditnota/:idc/:idf/t', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Bestelling.find({
    factuur: req.params.idf
  }, function(err, bestellingen) {
      var totBes = 0;
      for (var i = 0; i <= bestellingen.length - 1; i++) {
        totBes += bestellingen[i].totaal;
      }
      var _t;
      if (req.body.voorschot) {
        _t = totBes - req.body.voorschot;
      } else {
        _t = totBes;
      }
      var updateFactuur;
      if (req.body.voorschot !== "") {
        updateFactuur = {
          datum: req.body.datum,
          factuurNr: req.body.factuurNr,
          creditnr: req.body.creditnr,
          voorschot: req.body.voorschot,
          offerteNr: req.body.offerteNr,
          totaal: _t
        };
      } else {
        updateFactuur = {
          datum: req.body.datum,
          factuurNr: req.body.factuurNr,
          creditnr: req.body.creditnr,
          voorschot: req.body.voorschot,
          offerteNr: req.body.offerteNr
        };
      }
    res.redirect('/facturen/'+req.params.loginHash);
  });
});

app.get('/prijs/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Materiaal.find({}, function(err, materialen) {
          if (!err) {
            Profile.findOne({},function(err,profile){
              if(!err){
                res.render(settings.lang+'/calc/prijs', {
                  'settings': settings,
                  'profile': profile,
                  'materialen': materialen,
                  "loginHash": req.params.loginHash
                });
              }
            });
          }
        });
      }
    });
});

app.post('/prijs/:loginHash', function(req, res) {
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    var totaal = (req.body.uren * req.body.werkprijs);
    Materiaal.findOne({
      naam: req.body.o001
    }, function(err, m001) {
      totaal += req.body.i001 * m001.prijs;
      Materiaal.findOne({
        naam: req.body.o002
      }, function(err, m002) {
        if (m002)
          totaal += req.body.i002 * m002.prijs;
        Materiaal.findOne({
          naam: req.body.o003
        }, function(err, m003) {
          if (m003)
            totaal += req.body.i003 * m003.prijs;
          Materiaal.findOne({
            naam: req.body.o004
          }, function(err, m004) {
            if (m004)
              totaal += req.body.i004 * m004.prijs;
            Materiaal.findOne({
              naam: req.body.o005
            }, function(err, m005) {
              if (m005)
                totaal += req.body.i005 * m005.prijs;
              Materiaal.findOne({
                naam: req.body.o006
              }, function(err, m006) {
                if (m006)
                  totaal += req.body.i006 * m006.prijs;
                Materiaal.findOne({
                  naam: req.body.o007
                }, function(err, m007) {
                  if (m007)
                    totaal += req.body.i007 * m007.prijs;
                  Materiaal.findOne({
                    naam: req.body.o008
                  }, function(err, m008) {
                    if (m008)
                      totaal += req.body.i008 * m008.prijs;
                    Materiaal.findOne({
                      naam: req.body.o009
                    }, function(err, m009) {
                      if (m009)
                        totaal += req.body.i009 * m009.prijs;
                      Materiaal.findOne({
                        naam: req.body.o010
                      }, function(err, m010) {
                        if (m010)
                          totaal += req.body.i010 * m010.prijs;
                        Materiaal.findOne({
                          naam: req.body.o011
                        }, function(err, m011) {
                          if (m011)
                            totaal += req.body.i011 * m011.prijs;
                          Materiaal.findOne({
                            naam: req.body.o012
                          }, function(err, m012) {
                            if (m012)
                              totaal += req.body.i012 * m012.prijs;
                            Materiaal.findOne({
                              naam: req.body.o013
                            }, function(err, m013) {
                              if (m013)
                                totaal += req.body.i013 * m013.prijs;
                              Materiaal.findOne({
                                naam: req.body.o014
                              }, function(err, m014) {
                                if (m014)
                                  totaal += req.body.i014 * m014.prijs;
                                Materiaal.findOne({
                                  naam: req.body.o015
                                }, function(err, m015) {
                                  if (m015)
                                    totaal += req.body.i015 * m015.prijs;
                                  Materiaal.findOne({
                                    naam: req.body.o016
                                  }, function(err, m016) {
                                    if (m016)
                                      totaal += req.body.i016 * m016.prijs;
                                    Materiaal.findOne({
                                      naam: req.body.o017
                                    }, function(err, m017) {
                                      if (m017)
                                        totaal += req.body.i017 * m017.prijs;
                                      Materiaal.findOne({
                                        naam: req.body.o018
                                      }, function(err, m018) {
                                        if (m018)
                                          totaal += req.body.i018 * m018.prijs;
                                        Materiaal.findOne({
                                          naam: req.body.o019
                                        }, function(err, m019) {
                                          if (m019)
                                            totaal += req.body.i019 * m019.prijs;
                                          Materiaal.findOne({
                                            naam: req.body.o020
                                          }, function(err, m020) {
                                            if (m020)
                                              totaal += req.body.i020 * m020.prijs;
                                            Materiaal.findOne({
                                              naam: req.body.o021
                                            }, function(err, m021) {
                                              if (m021)
                                                totaal += req.body.i021 * m021.prijs;
                                              Materiaal.findOne({
                                                naam: req.body.o022
                                              }, function(err, m022) {
                                                if (m022)
                                                  totaal += req.body.i022 * m022.prijs;
                                                Materiaal.findOne({
                                                  naam: req.body.o023
                                                }, function(err, m023) {
                                                  if (m023)
                                                    totaal += req.body.i023 * m023.prijs;
                                                  Materiaal.findOne({
                                                    naam: req.body.o024
                                                  }, function(err, m024) {
                                                    if (m024)
                                                      totaal += req.body.i024 * m024.prijs;
                                                    Materiaal.findOne({
                                                      naam: req.body.o025
                                                    }, function(err, m025) {
                                                      if (m025)
                                                        totaal += req.body.i025 * m025.prijs;
                                                      Materiaal.findOne({
                                                        naam: req.body.o026
                                                      }, function(err, m026) {
                                                        if (m026)
                                                          totaal += req.body.i026 * m026.prijs;
                                                        Materiaal.findOne({
                                                          naam: req.body.o027
                                                        }, function(err, m027) {
                                                          if (m027)
                                                            totaal += req.body.i027 * m027.prijs;
                                                          Materiaal.findOne({
                                                            naam: req.body.o028
                                                          }, function(err, m028) {
                                                            if (m028)
                                                              totaal += req.body.i028 * m028.prijs;
                                                            Materiaal.findOne({
                                                              naam: req.body.o029
                                                            }, function(err, m029) {
                                                              if (m029)
                                                                totaal += req.body.i029 * m029.prijs;
                                                              Materiaal.findOne({
                                                                naam: req.body.o030
                                                              }, function(err, m030) {
                                                                if (m030)
                                                                  totaal += req.body.i030 * m030.prijs;
                                                                Materiaal.findOne({
                                                                  naam: req.body.o031
                                                                }, function(err, m031) {
                                                                  if (m031)
                                                                    totaal += req.body.i031 * m031.prijs;
                                                                  Materiaal.findOne({
                                                                    naam: req.body.o032
                                                                  }, function(err, m032) {
                                                                    if (m032)
                                                                      totaal += req.body.i032 * m032.prijs;
                                                                    Materiaal.findOne({
                                                                      naam: req.body.o033
                                                                    }, function(err, m033) {
                                                                      if (m033)
                                                                        totaal += req.body.i033 * m033.prijs;
                                                                      Materiaal.findOne({
                                                                        naam: req.body.o034
                                                                      }, function(err, m034) {
                                                                        if (m034)
                                                                          totaal += req.body.i034 * m034.prijs;
                                                                        Materiaal.findOne({
                                                                          naam: req.body.o035
                                                                        }, function(err, m035) {
                                                                          if (m035)
                                                                            totaal += req.body.i035 * m035.prijs;
                                                                          Materiaal.findOne({
                                                                            naam: req.body.o036
                                                                          }, function(err, m036) {
                                                                            if (m036)
                                                                              totaal += req.body.i036 * m036.prijs;
                                                                            Materiaal.findOne({
                                                                              naam: req.body.o037
                                                                            }, function(err, m037) {
                                                                              if (m037)
                                                                                totaal += req.body.i037 * m037.prijs;
                                                                              Materiaal.findOne({
                                                                                naam: req.body.o038
                                                                              }, function(err, m038) {
                                                                                if (m038)
                                                                                  totaal += req.body.i038 * m038.prijs;
                                                                                Materiaal.findOne({
                                                                                  naam: req.body.o039
                                                                                }, function(err, m039) {
                                                                                  if (m039)
                                                                                    totaal += req.body.i039 * m039.prijs;
                                                                                  Materiaal.findOne({
                                                                                    naam: req.body.o040
                                                                                  }, function(err, m040) {
                                                                                    if (m040)
                                                                                      totaal += req.body.i040 * m040.prijs;
                                                                                    Materiaal.findOne({
                                                                                      naam: req.body.o041
                                                                                    }, function(err, m041) {
                                                                                      if (m041)
                                                                                        totaal += req.body.i041 * m041.prijs;
                                                                                      Materiaal.findOne({
                                                                                        naam: req.body.o042
                                                                                      }, function(err, m042) {
                                                                                        if (m042)
                                                                                          totaal += req.body.i042 * m042.prijs;
                                                                                        Materiaal.findOne({
                                                                                          naam: req.body.o043
                                                                                        }, function(err, m043) {
                                                                                          if (m043)
                                                                                            totaal += req.body.i043 * m043.prijs;
                                                                                          Materiaal.findOne({
                                                                                            naam: req.body.o044
                                                                                          }, function(err, m044) {
                                                                                            if (m044)
                                                                                              totaal += req.body.i044 * m044.prijs;
                                                                                            Materiaal.findOne({
                                                                                              naam: req.body.o045
                                                                                            }, function(err, m045) {
                                                                                              if (m045)
                                                                                                totaal += req.body.i045 * m045.prijs;
                                                                                              Materiaal.findOne({
                                                                                                naam: req.body.o046
                                                                                              }, function(err, m046) {
                                                                                                if (m046)
                                                                                                  totaal += req.body.i046 * m046.prijs;
                                                                                                Materiaal.findOne({
                                                                                                  naam: req.body.o047
                                                                                                }, function(err, m047) {
                                                                                                  if (m047)
                                                                                                    totaal += req.body.i047 * m047.prijs;
                                                                                                  Materiaal.findOne({
                                                                                                    naam: req.body.o048
                                                                                                  }, function(err, m048) {
                                                                                                    if (m048)
                                                                                                      totaal += req.body.i048 * m048.prijs;
                                                                                                    Materiaal.findOne({
                                                                                                      naam: req.body.o049
                                                                                                    }, function(err, m049) {
                                                                                                      if (m049)
                                                                                                        totaal += req.body.i049 * m049.prijs;
                                                                                                      Materiaal.findOne({
                                                                                                        naam: req.body.o050
                                                                                                      }, function(err, m050) {
                                                                                                        if (m050)
                                                                                                          totaal += req.body.i050 * m050.prijs;
                                                                                                        Settings.findOne({}, function(err, settings) {
                                                                                                          if (!err) {
                                                                                                            if(settings.lang=="nl"){
                                                                                                            res.render('nl/calc/prijs-totaal', {
                                                                                                              "totaal": totaal.toFixed(2) + "€",
                                                                                                              "description": "Berekenen van prijs",
                                                                                                              "settings": settings,
                                                                                                              "loginHash": req.params.loginHash
                                                                                                            });}else{
                                                                                                              res.render('eng/calc/prijs-totaal', {
                                                                                                                "totaal": totaal.toFixed(2) + "€",
                                                                                                                "description": "Calculating price",
                                                                                                                "settings": settings,
                                                                                                                "loginHash": req.params.loginHash
                                                                                                              });
                                                                                                            }
                                                                                                          }
                                                                                                        });
                                                                                                      });
                                                                                                    });
                                                                                                  });
                                                                                                });
                                                                                              });
                                                                                            });
                                                                                          });
                                                                                        });
                                                                                      });
                                                                                    });
                                                                                  });
                                                                                });
                                                                              });
                                                                            });
                                                                          });
                                                                        });
                                                                      });
                                                                    });
                                                                  });
                                                                });
                                                              });
                                                            });
                                                          });
                                                        });
                                                      });
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

});

app.post('/prijs/:totaal/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!er) {
        var totaal_ = Number(req.params.totaal.substring(0, req.params.totaal.length - 1));
        var totaal = req.params.totaal;
        var marge = req.body.marge;
        res.render("nl/calc/prijs-totaal", {
          "totmarge": String(((totaal_ * marge / 100.0) + totaal_).toFixed(2)) + "€",
          "totaal": totaal,
          "settings": settings,
          'description': "berekening van marge",
          "loginHash": req.params.loginHash
        });
      }
    });
});

app.get('/mat/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Materiaal.find({}).sort('naam').exec(function(err, materialen) {
          if (!err) {
              Profile.findOne({},function(err,profile){
                  if(!err) {
                      res.render(settings.lang + '/mat', {
                          'materialen': materialen,
                          'settings': settings,
                          "loginHash": req.params.loginHash,
                          "profile":profile
                          });
                      }
                });
              }
        });
      }
    });
});

app.get('/edit-mat/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Materiaal.findOne({_id: req.params.id}, function(err, materiaal) {
          res.render('nl/edit/edit-mat', {
            'settings': settings,
            'materiaal': materiaal,
            'description': materiaal.naam + " aanpassen",
            "loginHash": req.params.loginHash
          });
        });
      }
    });
});

app.post('/edit-mat/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    var nieuwMat = {
      naam: req.body.naam,
      prijs: req.body.prijs
    };
    Materiaal.update({_id: req.params.id}, nieuwMat, function(err) {
        if(err){console.log('err: '+err);}
      res.redirect('/mat/' + req.params.loginHash);
    });
});

app.get('/add-mat/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
          Profile.findOne({},function(err,profile){if(!err){
        res.render('nl/add/add-mat', {
          'settings': settings,
            "profile":profile,
          "loginHash": req.params.loginHash
        });
      }});
      }
    });
});

app.post('/add-mat/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    var nieuwe_materiaal = new Materiaal({
      prijs: req.body.prijs,
      naam: req.body.naam
    });
    nieuwe_materiaal.save();
    res.redirect('/mat/' + req.params.loginHash);
});

app.get('/delete-mat/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Materiaal.remove({_id: req.params.id},function(err,mat){
    res.redirect('/mat/' + req.params.loginHash);
    });
});

app.get('/settings/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Profile.findOne({},function(err,profile){
    Settings.findOne({}, function(err, settings) {
      res.render(settings.lang+'/settings', {
        'settings': settings,
        'description': "Settings",
        'loginHash': req.params.loginHash,
        'profile':profile
      });
    });
  });
});

app.get('/change-theme/:th/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      var oppo;
      var nav = (req.params.th==="light") ? "light" : "dark";
      switch(req.params.th){
        case "dark":
          oppo = "light";
          break;
        case "primary":
          oppo = "outline-primary";
          break;
        case "light":
          oppo = "secondary";
          break;
        case "secondary":
          oppo = "secondary";
          break;
        case "info":
          oppo = "outline-info";
          break;
        case "danger":
          oppo = "outline-danger";
          break;
    }
      var updateSettings = {
        thema: req.params.th,
        oppo: oppo,
        nav: nav,
      };
      Settings.updateOne({_id: settings._id}, updateSettings, function(err) {
          if(err){console.log('err: '+err);}
          res.redirect('/settings/' + req.params.loginHash);
      });
  });
});

app.get('/change-lang/:lang/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var updateSettings = {
          lang: req.params.lang
        };
        Settings.updateOne({_id: settings._id}, updateSettings, function(err) {
            if(err){console.log('err: '+err);}
            res.redirect('/settings/' + req.params.loginHash);
        });
      }
    });
});

app.post('/edit-pdf-text/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var updateSettings = {
          factuurtext: req.body.factuurtext,
          creditnotatext:req.body.creditnotatext,
          offertetext:req.body.offertetext
        };
        Settings.updateOne({_id: settings._id}, updateSettings, function(err) {
          if(err){console.log('err: '+err);}
          res.redirect('/settings/' + req.params.loginHash);
        });
      }
    });
});

app.get('/zoeken', function(req, res) {//REWORKED
  res.redirect('/');
});

app.post('/percentage/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var percent = req.body.percent;
        var bedrag = req.body.bedrag;
        var error_input = (percent === "" && bedrag === "");
        var oplossing = bedrag * (percent / 100.0);
        if(settings.lang=="nl"){
        res.render('nl/calc/percentage', {
          'settings': settings,
          'description': "Berekening voor percentage",
          "oplossing": oplossing,
          "error": error_input,
          "loginHash": req.params.loginHash
        });}else{
          res.render('eng/calc/percentage', {
            'settings': settings,
            'description': "Percentage calculating",
            "oplossing": oplossing,
            "error": error_input,
            "loginHash": req.params.loginHash
          });
        }
      }
    });
});

app.get('/percentage/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        if(settings.lang=="nl"){
        res.render('nl/calc/percentage', {
          'settings': settings,
          'description': "Berekening voor percentage",
          "loginHash": req.params.loginHash
        });}else{
          res.render('eng/calc/percentage', {
            'settings': settings,
            'description': "Percentage calculating",
            "loginHash": req.params.loginHash
          });
        }
      }
    });
});

app.get('/add-project/:idc/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Materiaal.find({}, function(err, materialen) {
    Settings.findOne({}, function(err, settings) {
      if (!err) {
      if(settings.lang=="nl"){
        res.render('nl/add/add-project', {
          'materialen': materialen,
          'settings': settings,
          'description': "Project toevoegen",
          "loginHash": req.params.loginHash
        });}else{
          res.render('eng/add/add-project', {
            'materialen': materialen,
            'settings': settings,
            'description': "Add project",
            "loginHash": req.params.loginHash
          });
        }
      }
    });
  });
});

app.post('/add-project/:idc/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    var materialen = [];
    var aantallen = [];
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Contact.findOne({}, function(err, contact) {
          if (!contact) {
            res.redirect('add-project/' + req.params.loginHash);
          } else if (contact) {
            Materiaal.findOne({naam: req.body.o001},function(err, m001) {
                if (m001) {
                  materialen.push(m001.naam);
                  aantallen.push(m001.prijs);
                  var newProject = new Project({
                    naam: req.body.naam,
                    werkuren: req.body.werkuren,
                    werkprijs: req.body.werprijs,
                    materialen: materialen,
                    aantallen: aantallen,
                    contact: contact._id
                  });
                  newProject.save(function(err) {
                    console.log(err);
                  });
                }
              });
            }
          });
        }
        if(settings.lang=="nl"){
        res.render('nl/add/add-project', {
          'materialen': materialen,
          'settings': settings,
          'description': "Project toevoegen",
          "loginHash": req.params.loginHash
        });}else{
          res.render('eng/add/add-project', {
            'materialen': materialen,
            'settings': settings,
            'description': "Add project",
            "loginHash": req.params.loginHash
          });
        }
    });
});

app.get('/change-betaald/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
    Factuur.findOne({_id: req.params.id}, function(err, factuur) {
      if (!err) {
        Factuur.updateOne({_id: req.params.id}, {isBetaald: !(factuur.isBetaald),datumBetaald: getDatum(settings.lang)}, function(err) {
          if (!err) {
            res.redirect('/facturen/' + factuur.contact + "/" + req.params.loginHash);
          }
        });
      }
    });
  });
});

app.get('/change-betaald2/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
    Factuur.findOne({_id: req.params.id}, function(err, factuur) {
      if (!err) {
        Factuur.updateOne({_id: req.params.id}, {isBetaald: !(factuur.isBetaald),datumBetaald: getDatum(settings.lang)}, function(err) {
          if (!err) {
            res.redirect('/facturen/' + req.params.loginHash);
          }
        });
      }
    });
  });
});

app.get('/change-betaald3/:id/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Factuur.findOne({_id: req.params.id}, function(err, factuur) {
      if (!err) {
        Factuur.updateOne({_id: req.params.id}, {isBetaald: !(factuur.isBetaald),datumBetaald: getDatum(settings.lang)}, function(err) {
          if (!err) {
            res.redirect('/index/' + req.params.loginHash);
          }
        });
      }
    });
  });
});

app.get('/berekeningen/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Profile.findOne({},function(err,profile) {
          if (!err) {
            res.render(settings.lang + '/berekeningen', {
              'settings': settings,
              "profile": profile,
              "loginHash": req.params.loginHash
            });
          }
        });
      }
    });
});

app.get('/epo-sil/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if(!err){
      Profile.findOne({},function(err,profile){
        if(!err) {
            res.render(settings.lang + '/calc/epo-sil', {
              'settings': settings,
              'description': "Siliconen mal berekenen",
              "loginHash": req.params.loginHash,
              "e1": settings.e1,
              "e2": settings.e2,
              "e3": settings.e3,
              "e4": settings.e4,
              "s1": settings.s1,
              "s2": settings.s2,
              "s3": settings.s3,
              "s4": settings.s4,
              "profile":profile
            });
          }
        });
      }
    });
});

app.post('/epo-sil-oplossing/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var error = 0;//Error is 1 when negative numbers end as result
        var L = Number(req.body.L);
        var B = Number(req.body.B);
        var H = Number(req.body.H);
        var X = Number(req.body.X);
        var W = Number(req.body.W);
        //Siliconen
        var As = (L * B * H) * settings.s1; //S1
        var Dos = ((L + X) * (B + X) * (H + X)) * settings.s2; //S2
        var Ds = Dos - As;
        var Ms = (1 / settings.s3) * Ds; //Materiaal Uren siliconen //S3
        var Pws = (W * Ms); //prijs werkuren voor siliconen
        var Ps = (settings.s4 * Ds); //Prijs siliconen  //S4
        //Epoxie
        var Ae = ((L + X) * (B + X) * (H + X)) * settings.e1; //E1
        var Doe = ((L + X + 0.4) * (B + X + 0.4) * (H + X + 0.4)) * settings.e2; //E2
        var De = Doe - Ae;
        var Me = (1 / settings.e3) * De; //Materiaal Uren epoxie //E3
        var Pwe = (W * Me); //prijs werkuren epoxie
        var Pe = (settings.e4 * De); //E4
        //TOTAAL
        var Ptw = Pwe + Pws; //Prijs totaal werkuren
        var Ptm = Pe + Ps; //Prijs totaal materiaal
        var Pt = Ptw + Ptm; //Prijs totaal (werkuren + materiaal)
        var Mt = Me + Ms; //totaal uren voor alle materiaal
        if (Mt < 0 || Pt < 0) {
          error = 1;
        }
        Profile.findOne({},function(err,profile) {
          if (!err) {
            res.render(settings.lang + "/calc/epo-sil-oplossing", {
              "description": "Oplossing van berekening",
              "settings": settings,
              "L": L,
              "B": B,
              "H": H,
              "W": W,
              "X": X,
              "Ds": De,
              "As": As,
              "Dos": Dos,
              "Ds": Ds,
              "Ms": Ms,
              "Ae": Ae,
              "Doe": Doe,
              "De": De,
              "Me": String(Me).toTime(),
              "Ls": L + X,
              "Bs": B + X,
              "Hs": H + X,
              "Le": L + 0.4 + X,
              "Be": B + 0.4 + X,
              "He": H + 0.4 + X,
              "Ms": String(Ms).toTime(),
              "Pws": Pws,
              "Ps": Ps,
              "Pwe": Pwe,
              "Ptw": Ptw,
              "Ptm": Ptm,
              "Pt": Pt,
              "Mt": String(Mt).toTime(),
              "Pe": Pe,
              "loginHash": req.params.loginHash,
              "e1": settings.e1,
              "e2": settings.e2,
              "e3": settings.e3,
              "e4": settings.e4,
              "s1": settings.s1,
              "s2": settings.s2,
              "s3": settings.s3,
              "s4": settings.s4,
              "error": error,
              "profile":profile
            });
          }
        });
      }
    });
});

app.post('/epo-sil-marge/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var error = 0;
        var L = Number(req.body.L);
        var B = Number(req.body.B);
        var H = Number(req.body.H);
        var X = Number(req.body.X);
        var W = Number(req.body.W);
        var marge = Number(req.body.marge);
        //Siliconen
        var As = (L * B * H) * settings.s1;
        var Dos = ((L + X) * (B + X) * (H + X)) * settings.s2;
        var Ds = Dos - As;
        var Ms = (1 / settings.s3) * Ds; //Materiaal Uren siliconen
        var Pws = (W * Ms); //prijs werkuren voor siliconen
        var Ps = (settings.s4 * Ds); //Prijs siliconen
        //Epoxie
        var Ae = ((L + X) * (B + X) * (H + X)) * settings.e1;
        var Doe = ((L + X + 0.4) * (B + X + 0.4) * (H + X + 0.4)) * settings.e2;
        var De = Doe - Ae;
        var Me = (1 / settings.e3) * De; //Materiaal Uren epoxie
        var Pwe = (W * Me); //prijs werkuren epoxie
        var Pe = (settings.e4 * De);
        //TOTAAL
        var Ptw = Pwe + Pws; //Prijs totaal werkuren
        var Ptm = Pe + Ps; //Prijs totaal materiaal
        var Pt = Ptw + Ptm; //Prijs totaal (werkuren + materiaal)
        var Mt = Me + Ms; //totaal uren voor alle materiaal

        var totmarge = Pt + (Pt / 100) * marge;

        if (Mt < 0 || Pt < 0) {
          error = 1;
        }
        Profile.findOne({},function(err,profile) {
          if (!err) {
            res.render(settings.lang + "/calc/epo-sil-oplossing", {
              "description": "Oplossing van berekening",
              "settings": settings,
              "L": L,
              "B": B,
              "H": H,
              "W": W,
              "X": X,
              "Ds": De,
              "As": As,
              "Dos": Dos,
              "Ds": Ds,
              "Ms": Ms,
              "Ae": Ae,
              "Doe": Doe,
              "De": De,
              "Me": String(Me).toTime(),
              "Ls": L + X,
              "Bs": B + X,
              "Hs": H + X,
              "Le": L + 0.4 + X,
              "Be": B + 0.4 + X,
              "He": H + 0.4 + X,
              "Ms": String(Ms).toTime(),
              "Pws": Pws,
              "Ps": Ps,
              "Pwe": Pwe,
              "Ptw": Ptw,
              "Ptm": Ptm,
              "Pt": Pt,
              "Mt": String(Mt).toTime(),
              "Pe": Pe,
              "loginHash": req.params.loginHash,
              "marge": marge,
              "totmarge": totmarge.toFixed(2) + " €",
              "e1": settings.e1,
              "e2": settings.e2,
              "e3": settings.e3,
              "e4": settings.e4,
              "s1": settings.s1,
              "s2": settings.s2,
              "s3": settings.s3,
              "s4": settings.s4,
              "error": error,
              "profile":profile
            });
          }
        });
      }
    });
});

app.post('/epo-sil/update-vars/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var updateData = {
          e1: Number(req.body.e1),
          e2: Number(req.body.e2),
          e3: Number(req.body.e3),
          e4: Number(req.body.e4),
          s1: Number(req.body.s1),
          s2: Number(req.body.s2),
          s3: Number(req.body.s3),
          s4: Number(req.body.s4)
        };
        Settings.updateOne({_id: settings._id}, updateData, function(err) {
          if (!err) {
            res.redirect('/epo-sil/aanpassen/' + req.params.loginHash);
          }
        });
      }
    });
});

app.get('/epo-sil/aanpassen/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        Profile.findOne({},function(err,profile) {
          if (!err) {
            res.render('nl/calc/epo-sil', {
              'settings': settings,
              'description': "Siliconen mal berekenen",
              "loginHash": req.params.loginHash,
              "aangepast": 1,
              "e1": settings.e1,
              "e2": settings.e2,
              "e3": settings.e3,
              "e4": settings.e4,
              "s1": settings.s1,
              "s2": settings.s2,
              "s3": settings.s3,
              "s4": settings.s4,
              "profile":profile
            });
          }
        });
      }
    });
});

app.get('/inch/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        res.render('nl/calc/inch', {
          'settings': settings,
          'description': "Berekening voor inch & cm omzettingen",
          "loginHash": req.params.loginHash
        });
      }
    });
});

app.post('/inch/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      if (!err) {
        var inch = req.body.inch;
        var cm = req.body.cm;
        var cm_;
        var inch_;
        var oplossing;
        if (inch !== "" && cm !== "") {
          if(settings.lang=="nl"){
          res.render('nl/calc/inch', {
            'settings': settings,
            'description': "Berekening voor inch & cm omzettingen",
            "error": 1,
            "loginHash": req.params.loginHash
          });}else{
            res.render('eng/calc/inch', {
              'settings': settings,
              'description': "Calculations for inch & cm",
              "error": 1,
              "loginHash": req.params.loginHash
            });
          }
        } else {
          if (inch !== "") {
            cm = inch / 0.39370;
            cm_ = Number(cm).toFixed(2);
            inch_ = Number(inch).toFixed(2);
            oplossing = inch_ + "\" = " + cm_ + "cm";
            if(settings.lang=="nl"){
            res.render('nl/calc/inch', {
              'settings': settings,
              'description': "Berekening voor inch & cm omzettingen",
              "oplossing": oplossing,
              "loginHash": req.params.loginHash
            });}else{
              res.render('nl/calc/inch', {
                'settings': settings,
                'description': "Calculations for inch & cm",
                "oplossing": oplossing,
                "loginHash": req.params.loginHash
              });
            }
          }
          if (cm !== "") {
            inch = cm * 0.39370;
            cm_ = Number(cm).toFixed(2);
            inch_ = Number(inch).toFixed(2);
            oplossing = cm_ + "cm = " + inch_ + "\"";
            if(settings.lang=="nl"){
            res.render('nl/calc/inch', {
              'settings': settings,
              'description': "Berekening voor inch & cm omzettingen",
              "oplossing": oplossing,
              "loginHash": req.params.loginHash
            });}else{
              res.render('nl/calc/inch', {
                'settings': settings,
                'description': "Calculations for inch & cm",
                "oplossing": oplossing,
                "loginHash": req.params.loginHash
              });
            }
          }
          if(settings.lang=="nl"){
          console.log("error niets ingevuld");
          res.render('nl/calc/inch', {
            'settings': settings,
            'description': "Berekening voor inch & cm omzettingen",
            "error": 2,
            "loginHash": req.params.loginHash
          });}else{
            res.render('eng/calc/inch', {
              'settings': settings,
              'description': "Calculations for inch & cm",
              "error": 2,
              "loginHash": req.params.loginHash
            });}
          }
      }
    });
});

app.get('/pass/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      Profile.findOne({},function(err,profile){
        res.render(settings.lang+'/pass',{"loginHash":req.params.loginHash,"settings":settings,"profile":profile});
      });
    });
});

app.post('/pass/:loginHash', function(req, res) {//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
    Settings.findOne({}, function(err, settings) {
      Profile.findOne({},function(err,profile){
      if (!err) {
        if(req.body.pass === req.body.passRep){
          Settings.updateOne({_id: settings._id}, {pass:enc(req.body.pass)});
          res.render(settings.lang+'/settings',{"loginHash":enc(req.body.pass),"settings":settings,"error":1,"profile":profile});
        }else{
          res.render(settings.lang+'/pass',{"loginHash":req.params.loginHash,"settings":settings,"error":1,"profile":profile});
        }
      }
      });
    });
});

app.use(fileUpload());// TODO: check if this is needed?
app.use(bodyParser.urlencoded({ extended: true }));// TODO: Check if this is needed?

app.post('/upload-logo/:loginHash', function (req, res) {//REWORKED
    callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.redirect('login');
    }});
    if (Object.keys(req.files).length === 0) // TODO: THIS CHECK DOESNT WORK
      return res.status(400).send('No files were uploaded.');
    var sampleFile = req.files.sampleFile;
    sampleFile.mv('public/logo.jpeg', function(err) {
    if(err){console.log('err: '+err);}
    res.redirect('/edit-profile/'+req.params.loginHash);
  });
});

app.get('/upload/:loginHash',function(req,res){//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Profile.findOne({},function(err,profile){
    res.render(settings.lang+'/upload',{
      "loginHash":req.params.loginHash,
      "settings":settings,
      "description":"Upload logo",
      "profile":profile
    });
    });
  });
});

app.get('/btw/:loginHash',function(req,res){//REWORKED
  callFindPass().then(function(loginHash){
    if (String(req.params.loginHash) !== loginHash) {
      res.render('login');
    }});
  Settings.findOne({}, function(err, settings) {
    Profile.findOne({},function(err,profile){
      res.render(settings.lang+'/btw',{
        "loginHash":req.params.loginHash,
        "settings":settings,
        "description":"Updating...",
        "profile":profile
      });
    });
  });
});

app.post('/btw/:loginHash', function (req, res) {//REWORKED
    callFindPass().then(function(loginHash){
    if(String(req.params.loginHash) !== loginHash) {
      res.redirect('login');
    }});
    Settings.findOne({},function(err,settings){
      Settings.updateOne({_id: settings._id}, {btw:req.body.btw},function(err){
        if(err){console.log('err: '+err);}
          res.redirect('/settings/'+req.params.loginHash);
      });
    });
});

function isNumeric(num) {
  return !isNaN(num);
}

String.prototype.toTime = function() {
  var sec_num = parseInt(this * 3600, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + 'u ' + minutes + 'm';
};

function distinct(_array) {
  var array = _array;
  var disctincts = [];
  for (var o of array) {
    var isDistinct = true;
    for (var d of disctincts) {
      if (d._id == o._id) {
        isDistinct = false;
      }
    }
    if (isDistinct) {
      disctincts.push(o);
    }
  }
  return disctincts;
}

function replaceAll(str,profiel,contact,factuur,language){
  console.log("replacing");
    var date = new Date();
    var jaar = date.getFullYear();
    var datum = getDatum(language);
    var _maand;
    var res;
    var str = String(str);
    res = str.replace("[firm]",profiel.firma);
    res = str.replace("[firma]",profiel.firma);

    res = res.replace("[mail]",profiel.mail);

    res = res.replace("[name]",profiel.naam);
    res = res.replace("[naam]",profiel.naam);

    res = res.replace("[street]",profiel.straat);
    res = res.replace("[straat]",profiel.straat);

    res = res.replace("[nr]",profiel.straatnr);

    res = res.replace("[postal]",profiel.postcode);
  res = res.replace("[postcode]",profiel.postcode);

    res = res.replace("[place]",profiel.plaats);
    res = res.replace("[plaats]",profiel.plaats);

    res = res.replace("[vat]",profiel.btwNr);
    res = res.replace("[btw]",profiel.btwNr)

    res = res.replace("[iban]",profiel.iban);

    res = res.replace("[bic]",profiel.bic);

    res = res.replace("[tel]",profiel.tele);

    res = res.replace("[contact.rekeningnr]",contact.rekeningnr);
    res = res.replace("[contact.bank]",contact.rekeningnr);

    res = res.replace("[factuur.datum]",factuur.datum);
    res = res.replace("[invoice.date]",factuur.datum);

    res = res.replace("[date]",datum);
    res = res.replace("[datum]",datum);

    res = res.replace("[date.y]",jaar);
    res = res.replace("[datum.j]",jaar);

    res = res.replace("[date.m]",_maand);
  res = res.replace("[datum.m]",_maand);

    res = res.replace("[date.d]",date.getDate());
    res = res.replace("[datum.d]",date.getDate());

    res = res.replace("[invoice.advance]",factuur.voorschot.toFixed(2)+" €");
    res = res.replace("[factuur.voorschot]",factuur.voorschot.toFixed(2)+" €");

    res = res.replace("[invoice.total]",factuur.totaal.toFixed(2)+" €");
    res = res.replace("[factuur.totaal]",factuur.totaal.toFixed(2)+" €");
    console.log(res);
    return res.split('\r\n');
}

var findPass = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Seems like something went wrong'), 500);
    Settings.findOne({}, function(err, settings) {
      if(!err){
        resolve(settings.pass);
      }else{
        console.log(err);
        reject(err);
      }
    });
  });
};

//Async promise handler for getting the pass
var callFindPass = async () => {
  var loginHash = await (findPass());
  return loginHash
};

var getBase64 = () => {
  return new Promise((resolve,reject) => {
    var path = 'public/logo.jpeg';
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        //BASE64 image if no logo is uploaded
        resolve("data:image/png;base64,iVBORw0KGgoAAAANSUhsEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=");
        return;
      }else{
      imageToBase64(path).then((response) => {
          var imgData ="data:image/jpeg;base64,";
          imgData +=response;
          resolve(imgData);
        }).catch((error) =>{
        });
    }});
  });
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
  console.log(error);
});

var callGetBase64 = async () => {
  var imgData = await (getBase64());
  return imgData
}

var handlerCheckSettings = () => {
  return new Promise((resolve,reject) => {
    Settings.findOne({}, function(err, sett) {
      if(!sett){
          legeSettings = new Settings();
          legeSettings.save(function(err) {
            if (err) {
              reject("Err creating new settings: " + err);
            }else{
              resolve();
            }
          });
      }
      resolve();
    });
  });
};

var checkSettings = async () => {
  await(handlerCheckSettings());
};

var handlerCheckProfile = () => {
  return new Promise((resolve,reject) => {
    Profile.findOne({},function(err,prof){
      if(!prof){
        emptyProfile = new Profile();
        emptyProfile.save(function(err){
          if(err){
            reject("Err creating new profile: "+err);
          }else{
            resolve();
          }
        });
      }else{
        resolve();
      }
    });
  });
};

var checkProfile = async () => {
  await(handlerCheckProfile());
};

function enc(s){
  return String(Buffer.from(s).toString('base64'));
}

function dec(s){
  return String(Buffer.from(s, 'base64').toString());
}

function getDatum(lang){
  var date = new Date();
  if(lang==="nl"){
    return date.getDate() + " " + maand[date.getMonth()] + " " + date.getFullYear().toString();
  }else{
    return date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear().toString();
  }
}

function createJSON(obj){
  var json_data = "[";
  for (var i = 0; i <= Number(obj.length) - 1; i++) {
    json_data += ("{\"beschrijving\" : \"" + obj[Number(i)].beschrijving + "\", " +
      "\"aantal\" : " + obj[Number(i)].aantal + ", " +
      "\"bedrag\" : " + obj[Number(i)].bedrag + ", " +
      "\"totaal\" : " + Number(obj[Number(i)].aantal * obj[Number(i)].bedrag) + " }");
    if (i <= Number(obj.length) - 2) {
      json_data += ",";
    }
  }
  json_data += "]";
  return json_data;
}


app.engine('pug', require('pug').__express)

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');// TODO: Needs this to update to 'pug'

app.use(express.static(path.join(__dirname, 'public')));

app.listen('3000', function() {
  console.log('Server is running at PORT ' + 3000);
  Schema = mongoose.Schema;
});
/*
app.use(function(req, res) {
  res.staus(404).send('404: Page not Found');
});

// Handle 500
app.use(function(error, req, res, next) {
  res.status(500).send('500: Internal Server Error');
});
*/
