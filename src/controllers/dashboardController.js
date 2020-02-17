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
    //Finds a profile, if not found will create a new one
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
                            let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            let invoice_open = [];
                            for (let invoice of invoices) {
                                if (invoice.invoiceNr) {
                                    if(!invoice.isPaid){
                                        //adds to unpaid invoices
                                        invoice_open.push(invoice);
                                    }else{
                                        //Adds to chart data
                                        let monthOfPayment = invoice.datePaid.getMonth();
                                        console.log("adding invoice with month "+monthOfPayment+" idi: "+invoice._id);
                                        console.log("current year of invoice is:"+invoice.datePaid.getFullYear());
                                        console.log("Invoice is paid: "+invoice.isPaid);
                                        console.log('current year is: '+year);
                                        if(year===invoice.datePaid.getFullYear()&&invoice.isPaid) {
                                            chart[monthOfPayment] += invoice.total;
                                            console.log('added');
                                        }else{
                                            console.log('not added');
                                        }
                                    }
                                }
                            }
                            console.log('chart done: '+chart);
                            //createa data for chart
                            for (let i = 0; i <= 11; i++) {

                            }
                            res.render('index', {
                                'currentUrl':"dashboard",
                                "total": chart,
                                "settings": settings,
                                "year": year,
                                "profile": profile,
                                "invoices":invoice_open
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
                            let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            let invoice_open = [];
                            for (let invoice of invoices) {
                                if (invoice.invoiceNr) {
                                    if(!invoice.isPaid){
                                        //adds to unpaid invoices
                                        invoice_open.push(invoice);
                                    }else{
                                        //Adds to chart data
                                        let monthOfPayment = invoice.datePaid.getMonth();
                                        console.log("adding invoice with month "+monthOfPayment+" idi: "+invoice._id);
                                        console.log("current year of invoice is:"+invoice.datePaid.getFullYear());
                                        console.log("Invoice is paid: "+invoice.isPaid);
                                        console.log('current year is: '+req.params.year);
                                        if(req.params.year==invoice.datePaid.getFullYear()&&invoice.isPaid) {
                                            chart[monthOfPayment] += invoice.total;
                                            console.log('added');
                                        }else{
                                            console.log('not added');
                                        }
                                    }
                                }
                            }
                            console.log('chart done: '+chart);
                            //createa data for chart
                            for (let i = 0; i <= 11; i++) {

                            }
                            res.render('index', {
                                'currentUrl':"dashboard",
                                "total": chart,
                                "settings": settings,
                                "year": req.params.year,
                                "profile": profile,
                                "invoices":invoice_open
                            });
                        }
                    });
                }
            });
        }
    });
};