var path=require('path');
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var app=express();

// Form Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Database Connectivity
mongoose.connect('mongodb://localhost:27017/sample-website');
mongoose.connection.on('open',function() {
    console.log('Mongoose connected.');
});
var maand = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
Schema=mongoose.Schema;

// Creat Task Schema
var ProfileSchema=new Schema({
  firma:{type:String},
  naam:{type:String},
  straat:{type:String},
  straatNr:{type:String},
  postcode:{type:String},
  plaats:{type:String},
  btwNr:{type:String},
  iban:{type:String},
  bic:{type:String},
  nr:{type:Number,default:1}
});

var Profile=mongoose.model('Profile',ProfileSchema);

var BestellingSchema=new Schema({
    beschrijving:{type:String},
    aantal:{type:String},
    bedrag:{type:String},
    factuur:{type: Schema.Types.ObjectId, ref:'Factuur'}
})

var Bestelling=mongoose.model('Bestelling',BestellingSchema);

var FactuurSchema=new Schema({
    datum:{type:String},
    factuurNr:{type:Number},
    aantalBestellingen:{type:Number,default:0},
    contact: {type: Schema.Types.ObjectId, ref:'Contact'},
    bestellingen: [{type: Schema.Types.ObjectId, ref:'Bestelling'}],
    isBetaald : {type:Boolean,default:false},
    voorschot : {type: Number, default:0}
})

var Factuur=mongoose.model('Factuur',FactuurSchema);

var ContactSchema=new Schema({
    firma:{type:String},
    contactPersoon:{type:String},
    straat:{type:String},
    straatNr:{type:String},
    postcode:{type:String},
    plaats:{type:String},
    btwNr:{type:String},
    facturen: [{type: Schema.Types.ObjectId,ref:'Factuur'}],
    aantalFacturen:{type:Number,
      default:0
    }
});

var Contact=mongoose.model('Contact',ContactSchema);

app.get('/',function(req,res){
    console.log("-------------------------------------------------------------------------")
    console.log("#localhost:3000/ GET");
    Contact.find({},function(err,docs){
        res.render('contacten',{'contactenLijst':docs});
    });
});

app.get('/add-contact',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-contact GET");
    res.render('add-contact');
});


app.post('/add-contact',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-contact POST");
    if(
        req.body.contactPersoon &&
        req.body.straat &&
        req.body.plaats){
        var newContact=new Contact({
          firma:req.body.firma,
          contactPersoon:req.body.contactPersoon,
          straat:req.body.straat,
          straatNr:req.body.straatNr,
          postcode:req.body.postcode,
          plaats:req.body.plaats,
          btwNr:req.body.btwNr
        });
        var message='Contact toegevoegd';
        newContact.save(function(err){
            if(err){
                var message='Contact niet toegevoegd';
            }
        });
    }
    res.render('add-contact',{msg:message});
});

app.post('/add-bestelling/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-bestelling POST");
  Factuur.findOne({_id:req.params.idf},function(err,factuur){
    if(!err){
          var newBestelling=new Bestelling({
            beschrijving:req.body.beschrijving,
            aantal:req.body.aantal,
            bedrag:req.body.bedrag,
            factuur:req.params.idf
          })
          newBestelling.save(function(err){
            if(err){
              console.log(err);
            }
          });
          res.redirect('/bestellingen/'+req.params.idf);
        }
      });
});

app.get('/add-bestelling/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#add-bestelling GET");
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
        res.render('add-bestelling',{'factuur':factuur});
      }
    });
});

app.get('/edit-bestelling/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-bestelling GET");
  Bestelling.findOne({_id:req.params.id},function(err,bestelling){
    res.render('edit-bestelling',{'bestelling':bestelling});
  });
});

app.post('/edit-bestelling/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-bestelling POST");
  console.log("looking for bestelling with id:"+req.params.id);
  var updateBestelling={
    beschrijving:req.body.beschrijving,
    aantal:req.body.aantal,
    bedrag:req.body.bedrag
  }
  Bestelling.update({_id:req.params.id},updateBestelling,function(err,numrows){
    Bestelling.findOne({_id:req.params.id},function(err,bestelling){

        if(!err){
          res.redirect('/bestellingen/'+bestelling.factuur);
        }else{
          console.log("err edit-bestelling POST : "+err);
        }
    });
  });
});

app.get('/edit-contact/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-contact GET");
    Contact.findOne({_id:req.params.id},function(err,docs){
        res.render('edit-contact',{'contact':docs});
    });
});

//request pdf generation
app.get('/createPDF/:idf', function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#create-pdf");
  var id = req.params.id;

  Profile.find({},function(err,profile){
    console.log("found profile: "+profile);
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      console.log("found factuur: "+factuur);
      if(err)
        console.log("err: "+err);
      Contact.findOne({_id:factuur.contact},function(err2,contact){
        if(err2)
          console.log("err: "+err2);
        Bestelling.find({factuur:factuur._id},function(err3,bestellingen){
          console.log("found :"+bestellingen);
          if(err3){
            console.log("err: "+err3);
          }
          var lengte=Number(bestellingen.length);
          var json_data = "[";
          for(var i = 0; i<= lengte-1;i++){
            console.log("adding "+bestellingen[i]+"...");
            json_data +=("{\"beschrijving\" : \""+bestellingen[Number(i)].beschrijving+"\", "
                            +"\"aantal\" : "+bestellingen[Number(i)].aantal+", "
                            +"\"bedrag\" : "+bestellingen[Number(i)].bedrag+", "
                            +"\"totaal\" : "+Number(bestellingen[Number(i)].aantal*bestellingen[Number(i)].bedrag)+" }");
            if(i <= lengte-2){
              json_data +=",";
            }
          }
          json_data += "]";
          console.log("#BESTELLINGEN => "+json_data);
          res.render('pdf',{'profile':profile[0],'contact':contact,'bestellingen':json_data,"factuur":factuur,'lengte':lengte});
        });
      });
    });
  });
});

app.post('/edit-contact/:id',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#edit-contact : idc:"+req.params.id);
    var updateData={
      firma:req.body.firma,
      contactPersoon:req.body.contactPersoon,
      straat:req.body.straat,
      straatNr:req.body.straatNr,
      postcode:req.body.postcode,
      plaats:req.body.plaats,
      btwNr:req.body.btwNr,
    };
    var message='Factuur niet geupdate';
    Contact.update({_id:req.params.id},updateData,function(err,numrows){
        if(!err){
            res.redirect('/edit-contact/'+req.params.id);
        }
    });
});

app.get('/add-factuur/:idc',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#add factuur");
  var date=new Date();
  var jaar = date.getFullYear();
  var datum = date.getDate()+" "+maand[date.getMonth()]+" "+jaar;
  console.log(datum);
  var nr = 0;
  var idn;
  var _n = null;
  var factuurID;
  Contact.findOne({_id:req.params.idc},function(err,contact){
    if(!err){
      contact.save(function(err){
        if(!err){
          Profile.find({},function(err,nummer){
              if(!err){
                console.log("profile: "+nummer);
                var _n = nummer;
                nr = nummer[0].nr;
              }
              nummer[0].save(function(err){
                Profile.updateOne({nr:nr+1},function(err){
                  if(err){
                    console.log("error in profile: "+err);
                  }else{
                    var nr_str = nr.toString();
                    if(nr_str.toString().length == 1){
                      nr_str = "00"+nr.toString();
                    }else if(nr_str.toString().length == 2){
                      nr_str = "0"+nr.toString();
                    }

                    console.log("updating nr in profile");
                    console.log("getting factuur nr: "+jaar+nr_str);
                    const newFactuur = new Factuur({
                      contact: contact._id,
                      datum: datum,
                      factuurNr: String(jaar+nr_str)
                    });
                    Contact.updateOne({aantalFacturen:contact.aantalFacturen+1},function(err){
                      if(err){
                        console.log("err contact.updateOne: "+err);
                      }else{
                        contact.facturen.push(newFactuur._id);
                      }
                    });
                    newFactuur.save(function(err){
                      if(!err){
                        factuurID = newFactuur._id;
                        console.log("factuurID"+factuurID)
                        res.redirect('/edit-factuur/'+req.params.idc+'/'+newFactuur._id);
                      }
                      if(err){
                        console.log("err newFactuur: "+err);
                      }
                    });
                  }
                });
              });
            });
        }else{
          console.log("err contact.save: "+ err);
        }
      });
    }
  });
});

app.get('/delete-contact/:id',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-contact GET");
    Contact.remove({_id:req.params.id},function(err){
        if(!err){
        }
    });
    Contact.find({},function(err,contacten){
        res.render('contacten',{'contactenLijst':contacten});
    });
});

app.get('/delete-factuur/:idc/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-factuur GET");
    Contact.findOne({_id:req.params.idc},function(err,contact){
        Factuur.deleteOne({_id:req.params.idf},function(err){
          if(!err){
            Factuur.find({contact:req.params.idc},function(err,facturen){
              if(!err){
                console.log("succesfully deleted factuur ( id:"+req.params.idf+" )");
                res.render('facturen',{'contact':contact,'facturenLijst':facturen,'description':"Facturen van "+contact.contactPersoon});
                }else{
                console.log("err factuur.find: "+err);
              }
            });

            }else{
            console.log("err factuur.deleteOne: "+err);
          }
        });
    });
});

app.get('/delete-bestelling/:idb',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#delete-bestelling GET");
    Bestelling.findOne({_id:req.params.idb},function(err,bestelling){
      Factuur.findOne({_id:bestelling.factuur},function(err,factuur){
          Bestelling.deleteOne({_id:req.params.idb},function(err){
                if(!err){
                  console.log("succesfully deleted bestelling ( id:"+req.params.idb+" )");
                  console.log(factuur);
                  res.redirect('/bestellingen/'+factuur._id);
                  }else{
                  console.log("err bestelling.find: "+err);
                  }
          });
      });
    });
});

app.get('/facturen/:idc',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#facturen GET : idc:"+req.params.idc);
    var contact;
    Contact.findOne({_id:req.params.idc},function(err,_contact){
      if(!err){
        contact=_contact;
        Factuur.find({contact:req.params.idc},function(err,facturen){
        if(!err){
            console.log(facturen);
            res.render('facturen',{'contact':contact,'facturenLijst':facturen,'description':"Facturen van "+contact.contactPersoon});
        }else{
          console.log("err factuur.find: "+err);
        }
        });
      }else{
        console.log("err contact.findOne: "+err);
      }
    });
});

app.get('/bestellingen/:idf',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("#bestellingen GET");
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
        console.log("factuur succesfully found: "+factuur);
        console.log("factuur id :"+factuur._id);
        Bestelling.find({factuur:req.params.idf},function(err,bestellingen){
          if(!err){
            console.log("bestelling succesfully found: "+bestellingen);
            res.render('bestellingen',{'factuur':factuur,'bestellingen':bestellingen,'description':"Bestellingen"});
            }
        });
      }
    });
});

app.get('/view-contact/:idc',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#view-contact GET");
  Contact.findOne({_id:req.params.idc},function(err,contact){
    if(!err){
          res.render('view-contact',{'contact':contact});
    }else{
      console.log("err view-contact: "+err);
    }
  });
});


// Show the Index Page
app.get('/',function(req,res){
    console.log("-------------------------------------------------------------------------");
    console.log("localhost:3000 render");
    res.render('contacten',{"description":"Contacten"});
});

app.get('/edit-profile/',function(req,res){
      console.log("-------------------------------------------------------------------------");
      console.log("#edit-profile GET");
      var legeProfiel;
      var date = new Date();
      var _jaar = date.getFullYear();
      var jaar = _jaar.toString();
      Profile.find({},function(err,profile){
            if(!err){
                  if(profile.length==0){
                        console.log("profiel is nog niet gemaakt, nieuwe word gecreërd");
                        legeProfiel = new Profile();
                        legeProfiel.save(function(err){
                            if(err){
                                console.log("err edit-profile: "+err);
                            }
                        });
                        console.log(legeProfiel)
                        res.render('edit-profile',{'profile':legeProfiel});
                    }else{
                        console.log("\nprofile: "+profile[0]);
                        var _nr = profile[0].nr;
                        var nr_str = _nr.toString();
                        if(nr_str.toString().length == 1){
                          nr_str = "00"+_nr.toString();
                        }else if(nr_str.toString().length == 2){
                          nr_str = "0"+_nr.toString();
                        }
                        res.render('edit-profile',{'profile':profile[0],'nr':Number(jaar+nr_str)});
                    }
              }
      });
});

app.post('/edit-profile/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-profile POST");
  var _nr2 = req.body.nr.toString();
  var _nr = Number(_nr2.substring(_nr2.length-3));
  var updateProfile={
    firma:req.body.firma,
    naam:req.body.naam,
    straat:req.body.straat,
    straatNr:req.body.straatNr,
    postcode:req.body.postcode,
    plaats:req.body.plaats,
    btwNr:req.body.btwNr,
    iban:req.body.iban,
    bic:req.body.bic,
    nr:_nr
  }
  Profile.update({_id:req.params.id},updateProfile,function(err,updatedprofile){
    if(!err){
      res.redirect('/');
    }else{
      console.log(err);
    }
  });
});

app.get('/edit-factuur/:idc/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur GET");
  Contact.findOne({_id:req.params.idc},function(err,contact){
    console.log("contact succesfully found: "+contact );
    Factuur.findOne({_id:req.params.idf},function(err,factuur){
      if(!err){
          console.log("factuur succesfully found : "+factuur);
          res.render('edit-factuur',{'factuur':factuur,'contact':contact});
      }else{
        console.log("err edit-factuur GET: "+err);
      }
    });
  });
});

app.post('/edit-factuur/:idc/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur POST");
  var updateFactuur={
    datum:req.body.datum,
    factuurNr:req.body.factuurNr,
    voorschot:req.body.voorschot
  };
  Contact.findOne({_id:req.params.idc},function(err,contact){
    console.log(contact)
    Factuur.update({_id:req.params.idf},updateFactuur,function(err,factuur){
      if(!err){
        console.log(factuur);
        res.redirect('/facturen/'+contact._id);
      }else{
        console.log(err);
      }
    });

  });
});

app.get('/view-factuur/:idf',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#edit-factuur GET");
  Factuur.findOne({_id:req.params.idf},function(err,factuur){
    if(!err){
      console.log("factuur succesfully found: "+factuur);
      Contact.findOne({_id:factuur.contact},function(err,contact){
        console.log("contact from factuur succesfully found: "+contact);
        res.render('view-factuur',{'factuur':factuur,'contact':contact});
      });
    }
  });
});

app.get('/view-bestelling/:idb',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#view-bestelling GET");
  Bestelling.findOne({_id:req.params.idb},function(err,bestelling){
    if(!err){
      res.render('view-bestelling',{'bestelling':bestelling});
    }
  });
});

app.get('/change-betaald/:id',function(req,res){
  console.log("-------------------------------------------------------------------------");
  console.log("#change-betaald GET");
  Factuur.findOne({_id:req.params.id},function(err,factuur){
    if(!err){
      console.log("factuur found: "+factuur);
      var voor = new Boolean();
      voor = !(factuur.isBetaald);
      console.log("betaald now: "+voor);
      //update(req.params.idf,voor);
      Factuur.updateOne({_id:req.params.idf},{isBetaald:voor},function(err,result){
        if(!err){
          res.redirect('/facturen/'+factuur.contact);
        }
      });
    }
  });
});

// Set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set Public Folder as static Path
app.use(express.static(path.join(__dirname, 'public')));

// Run the Server
app.listen('3000',function(){
    console.log('Server is running at PORT '+3000);
Schema=mongoose.Schema;

});
async function update(id,voor){
  await Factuur.updateOne({_id:id},{isBetaald:voor});
  console.log("updated");
}
