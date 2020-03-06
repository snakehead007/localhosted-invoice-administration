/**
 * @module controllers/dashboardController
 */

const Settings = require("../models/settings");
const Profile = require("../models/profile");
const Invoice = require("../models/invoice");
const {month, month_small, year} = require("../utils/date");
const User = require("../models/user");

/**
 * @apiVersion 3.0.0
 * @api {get} / mainGet
 * @apiDescription This gives back the dashboard
 * @apiName mainGet
 * @apiGroup Dashboard
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {{
        "currentUrl": "dashboard",
        "total": newChart,
        "settings": settings,
        "year": (new Date).getFullYear(),
        "profile": profile,
        "invoices": invoice_open,
        "role": role
    }
 */
exports.mainGet = async function getLogin(req, res) {
    if (!req.session._id) {
        res.redirect("/");
    }
    let fact_open = [];
    //Finds a profile, if not found will create a new one
    Profile.findOne({fromUser: req.session._id}, async function (err, profile) {
        if (profile === null) {
            const newProfile = new Profile({
                fromUser: req.session._id
            });
            await newProfile.save();
            profile = await Profile.findOne({fromUser: req.session._id});
            await User.updateOne({_id: req.session._id}, {profile: profile._Id});
        }
        if (err) {
            console.trace(err);
        }
        if (!err) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if (!err) {
                    Invoice.find({fromUser: req.session._id,isRemoved:false}, async (err, invoices) => {
                        if (!err) {
                            let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            let invoice_open = [];
                            for (let invoice of invoices) {
                                if (invoice.invoiceNr) {
                                    if (!invoice.isPaid) {
                                        //adds to unpaid invoices
                                        invoice_open.push(invoice);
                                    } else if(invoice.datePaid){
                                        //Adds to chart data
                                        let monthOfPayment = invoice.datePaid.getMonth();
                                        if ((new Date()).getFullYear() == invoice.datePaid.getFullYear() && invoice.isPaid) {
                                            chart[monthOfPayment] += invoice.total;
                                        }
                                    }
                                }
                            }
                            let newChart = [];
                            chart.forEach((n) => {
                                newChart.push(n.toFixed(2))
                            });
                            let role = (await User.findOne({_id: req.session._id}, (err, user) => {
                                return user
                            })).role;
                            console.log(year);
                            res.render("index", {
                                "currentUrl": "dashboard",
                                "total": newChart,
                                "settings": settings,
                                "year": (new Date).getFullYear(),
                                "profile": profile,
                                "invoices": invoice_open,
                                "role": role
                            });
                        }
                    });
                }
            });
        }
    });
};
/**
 * @apiVersion 3.0.0
 * @api {get} /chart/:year chartYearGet
 * @apiDescription This gives back the dashboard but with a different year, with the parameter :year as a number
 * @apiName chartYearGet
 * @apiGroup Dashboard
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
        "currentUrl": "dashboard",
        "total": newChart,
        "settings": settings,
        "year": req.params.year,
        "profile": profile,
        "invoices": invoice_open,
        "role": role
    }
 @apiParamExample Request-Example:
 *  {
 *     "year": 2019
 *  }
 */
exports.chartYearGet = (req, res) => {
    if (!req.session._id) {
        res.redirect("/");
    }
    let fact_open = [];
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if (!err) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if (!err) {
                    Invoice.find({fromUser: req.session._id,isRemoved:false}, async (err, invoices) => {
                        if (!err) {
                            let chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                            let invoice_open = [];
                            for (let invoice of invoices) {
                                if (invoice.invoiceNr) {
                                    if (!invoice.isPaid) {
                                        //adds to unpaid invoices
                                        invoice_open.push(invoice);
                                    } else {
                                        //Adds to chart data
                                        let monthOfPayment = invoice.datePaid.getMonth();
                                        if (req.params.year == invoice.datePaid.getFullYear() && invoice.isPaid) {
                                            chart[monthOfPayment] += invoice.total;
                                        }
                                    }
                                }
                            }
                            let newChart = [];
                            chart.forEach((n) => {
                                newChart.push(n.toFixed(2))
                            });
                            let role = (await User.findOne({_id: req.session._id}, (err, user) => {
                                return user
                            })).role;
                            res.render("index", {
                                "currentUrl": "dashboard",
                                "total": newChart,
                                "settings": settings,
                                "year": req.params.year,
                                "profile": profile,
                                "invoices": invoice_open,
                                "role": role
                            });
                        }
                    });
                }
            });
        }
    });
};


exports.chartYearlyGet = (req, res) => {
    if (!req.session._id) {
        res.redirect("/");
    }
    let fact_open = [];
    Profile.findOne({fromUser: req.session._id}, function (err, profile) {
        if (!err) {
            Settings.findOne({fromUser: req.session._id}, function (err, settings) {
                if (!err) {
                    client.find({fromUser: req.session._id,isRemoved:false}, async (err, clients) => {
                        if (!err) {
                            let chart= [0,0,0];
                            }
                            let newChart = [];
                            chart.forEach((n) => {
                                newChart.push(n.toFixed(2))
                            });
                            let role = (await User.findOne({_id: req.session._id}, (err, user) => {
                                return user
                            })).role;
                            res.render("index", {
                                "currentUrl": "dashboard",
                                "total": newChart,
                                "settings": settings,
                                "year": req.params.year,
                                "profile": profile,
                                "invoices": invoice_open,
                                "role": role
                            });
                    });
                }
            });
        }
    });
};