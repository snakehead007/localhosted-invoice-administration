/**
 * @module controllers/dashboardController
 */

const Settings = require('../models/settings');
const Profile = require('../models/profile');
const Invoice = require('../models/invoice');
const {month, month_small,year} = require('../utils/date');
const User = require('../models/user');

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.main_get =  async function getLogin(req,res){
    if(!req.session._id){
        res.redirect('/');
    }
    let fact_open = [];
    Profile.findOne({fromUser:req.session._id}, async function(err,profile){
        if(profile===null){
            console.log("[Error]: Profile not found from user");
            const newProfile = new Profile({
                fromUser:req.session._id
            });
            await newProfile.save();
            profile = await Profile.findOne({fromUser:req.session._id});
            await User.updateOne({_id:req.session._id},{profile:profile._Id});
            console.log("[Error]: New profile successfully created for user");
        }
        if(err) console.trace(err);
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
                                            if ((String(invoice.datePaid).includes(month[i]) || String(invoice.datePaid).includes(month_small[i]) || String(invoice.datePaid).includes(month[i]) || String(invoice.datePaid).includes(month_small[i])) && invoice.datePaid.includes(year) && invoice.datePaid && invoice.isPaid) {
                                                total[i] += invoice.total;
                                            }
                                        } else if ((String(invoice.date).includes(month[i]) || String(invoice.date).includes(month_small[i]) || String(invoice.date).includes(month[i]) || String(invoice.date).includes(month_small[i])) && iString(invoice.date).includes(year) && invoice.invoiceNr && invoice.isPaid) {
                                            total[i] += invoice.total;
                                        }
                                        if ((String(invoice.date).includes(month[i]) || String(invoice.date).includes(month_small[i]) || String(invoice.date).includes(month[i]) || String(invoice.date).includes(month_small[i])) && !invoice.isPaid){
                                            fact_open.push(invoice);
                                        }
                                    }
                                }
                            }
                            res.render('index', {
                                'currentUrl':"dashboard",
                                "total": total,
                                "settings": settings,
                                "year": year,
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
/**
 *
 * @param req
 * @param res
 */
exports.chart_year_get = (req,res) => {
    if(!req.session._id){
        res.redirect('/');
    }
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
                                            if ((invoice.datePaid.includes(month[i]) || invoice.datePaid.includes(month_small[i]) || invoice.datePaid.includes(month[i]) || invoice.datePaid.includes(month_small[i])) && invoice.datePaid.includes(req.params.year) && invoice.datePaid && invoice.isPaid) {
                                                total[i] += invoice.total;
                                            }
                                        } else if ((invoice.date.includes(month[i]) || invoice.date.includes(month_small[i]) || invoice.date.includes(month[i]) || invoice.date.includes(month_small[i])) && invoice.date.includes(req.params.year) && invoice.invoiceNr && invoice.isPaid) {
                                            total[i] += invoice.total;
                                        }
                                        if ((invoice.date.includes(month[i]) || invoice.date.includes(month_small[i]) || invoice.date.includes(month[i]) || invoice.date.includes(month_small[i])) && !invoice.isPaid){
                                            fact_open.push(invoice);
                                        }
                                    }
                                }
                            }
                            console.log(year);
                            res.render('chart', {
                                'currentUrl':"chart",
                                "total": total,
                                "settings": settings,
                                "year": req.params.year,
                                "profile": profile,
                            });
                        }
                    });
                }
            });
        }
    });
};