//This is testing router, to test validations without having to login each time

const validate = require('../utils/formValidation');
/*
exports.iban = (req,res)=> {
    res.send(validate.valueMustBeValidIban(req.params.iban));
};

exports.bic = (req,res) => {
  res.send(validate.valueMustBeValidBic(req.params.bic));
};

exports.vat = (req,res) => {
    res.send(validate.valueMustBeVatNumber(req.params.vat));
};

exports.streetNr = (req,res) => {
    res.send(validate.valueMustBeStreetNumber(req.params.nr));
};
*/

exports.name = (req,res) => {
    res.send(validate.valueMustBeAName(req,res,req.params.name,"",req.params.bool==="true"));
};
exports.noName = (req,res) => {
    res.send(validate.valueMustBeAName(req,res,"","",req.params.bool==="true"));
};