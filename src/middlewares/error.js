const {sendMessage} = require('../../messages/messages');
const logger = require("./logger");
const i18n = require('i18n');
exports.findOneHasError = (req, res, err, object) => {
    if (err || !object || object === "null" || object === "undefined" || JSON.stringify(object) === "null") {
        req.flash('danger', "Error: something happened, please try again");
        res.redirect('back');
        return true;
    } else {
        return false
    }
};

exports.updateOneHasError = (req, res, err) => {
    if (err) {
        req.flash('danger', "Error: something happened, please try again");
        console.trace("[ERROR]: " + err);
        res.redirect('back');
        return true;
    } else {
        return false
    }
};

exports.findHasError = (req, res, err, object) => {
    return this.findOneHasError(req,res,err,object);
};

exports.findNullableHasError = (req, res, err, object) => {
    if (err) {
        req.flash('danger', "Error: something happened, please try again");
        res.redirect('back');
        return true;
    } else {
        return false
    }
};
exports.handler = (req,res,err,errNr,errMessage='',redirect='back') =>{
    if(err){
        let msg = (errMessage!=="")?' Message:'+errMessage:'';
        logger.error.log("[ERROR]: #"+errNr+msg+" Trace: "+err.message);
        console.trace(err);
        req.flash('danger',i18n.__("We experienced an error on our part, please try again or fill in a bug report. Error nr")+":"+errNr);
        if(redirect!=="NO_REDIRECT"){
            res.redirect(redirect);
        }
        return true;
    }
    return false;
};