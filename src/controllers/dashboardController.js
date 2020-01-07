const User = require('../models/user.js');
const google = require('../middlewares/google');
const Database = require('../models/database');
const Profile = require('../models/profile');
const Settings = require('../models/settings');
const Invoice = require('../models/invoice');
const {month, month_small,year} = require('../utils/date');

exports.main_get =  async function getLogin(req,res){
    req.session._id = await checkSignIn(await google.getGoogleAccountFromCode(req.query.code));
    let fact_open = [];
    Profile.findOne({fromUser:req.session._id}, function(err,profile){
        if(!err){
            Settings.findOne({fromUser:req.session._id}, function(err, settings) {
                if (!err) {
                    Invoice.find({fromUser:req.session._id}, function (err, invoices) {
                        if (!err) {
                            let total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            for (let i = 0; i <= 11; i++) {
                                for (let invoice of invoices) {// TODO: 'for of' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).
                                    if (invoice.invoiceNr) {
                                        if (invoice.datePaid) {
                                            if ((invoice.datePaid.includes(month[i]) || invoice.datePaid.includes(month_small[i]) || invoice.datePaid.includes(month[i]) || invoice.datePaid.includes(month_small[i])) && invoice.datePaid.includes(year) && invoice.datePaid && invoice.isPaid) {
                                                total[i] += invoice.total;
                                            }
                                        } else if ((invoice.date.includes(month[i]) || invoice.date.includes(month_small[i]) || invoice.date.includes(month[i]) || invoice.date.includes(month_small[i])) && invoice.date.includes(year) && invoice.invoiceNr && invoice.isPaid) {
                                            total[i] += invoice.total;
                                        }
                                        if ((invoice.date.includes(month[i]) || invoice.date.includes(month_small[i]) || invoice.date.includes(month[i]) || invoice.date.includes(month_small[i])) && !invoice.isPaid){
                                            fact_open.push(invoice);
                                        }
                                    }
                                }
                            }
                            res.render(settings.lang+'/index', {
                                "totaal": total,
                                "settings": settings,
                                "jaar": year,
                                "profile": profile,
                                "facturenLijst":invoices,
                                "fact_open":fact_open
                            });
                        }
                    });
                }
            });
        }
    });
};

async function checkSignIn({googleId,email,tokens}){
    const currentUser = await User.findOne({googleId:googleId},function(err,User){
        if(err) throw new Error(err);
        return User;
    });
    if(!currentUser){//new user, add user to database
        //create user
        const newUser = new User({
            googleId: googleId,
            email:email,
            tokens:tokens
        });
        await newUser.save();
        //find new user.__id, add ID to database
        const currentUserId = await User.findOne({googleId:googleId},function(err,User){
            if(err) throw new Error(err);
            return User._id;
        });
        const newSettings = new Settings({
            fromUser:currentUserId
        });
        await newSettings.save();
        const newProfile = new Profile({
            fromUser:currentUserId
        });
        await newProfile.save();
        const settingsId = await Settings.findOne({fromUser:currentUserId});
        const profileId = await Profile.findOne({fromUser:currentUserId});
        await User.update({_id:currentUserId},{settings:settingsId,profile:profileId});
        return currentUserId;
    }else{//user already added
        return currentUser._id;
    }
}