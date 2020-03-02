//This javascript file has the methods to invalid various forms
const jsvat = require("jsvat");
const IBAN = require("iban");
const ibantools = require("ibantools");
const i18n = require("i18n");
//Method name => [Type]+[invalids when] e.g.valueMustNotBeEmpty(), valueMustBeCorrectZipCode()
//return value: {invalid: true, doc: [given document parameter]}

exports.valueMustNotBeEmpty = (req, res, doc, mustBeFilledIn = false, message = "This value must not be empty!") => {
    let invalid = message.trim() === "";
    return checkForMessage(req, invalid,message);
};

exports.valueMustBeAName = (req, res, doc, mustBeFilledIn = false, message = "This value is invalid, please provide a correct name") => {
    let invalid = checkRegex(doc, /^[a-zA-Z0-9&àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};


exports.valueMustBeEmail = (req, res, doc, mustBeFilledIn = false, message = "This value is invalid, please provide a correct email address") => {
    //A name must only contain [a-z] [A-Z] .
    let invalid = checkRegex(doc, /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};

exports.numberMustPhoneNumber = (req, res, doc, mustBeFilledIn = false, message = "Phone number is invalid, please provide a correct phone number") => {
    let invalid = checkRegex(doc, /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/u,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};

exports.valueMustBeVatNumber = (req, res, doc, mustBeFilledIn = false,locale="nl-BE", message = "VAT number not valid") => {
    if(doc==="" && !mustBeFilledIn){
        return false;
    }else {
        //replace all '.' occurences in the vat string with nothing
        let currentVat = this.formatBEVat(doc);

        let invalid = !(jsvat.checkVAT(currentVat, jsvat.countries).isValid);
        return checkForMessage(req, invalid, message);
    }
};
exports.formatBEVat=(vat)=> {
    //remove dots
    let currentVat = vat.replace(/\.+/g,'');
    //remove letters
    currentVat = currentVat.replace(/[A-Za-z]/g,'');
    //remove whitespace
    currentVat = currentVat.trim();
    let finalVat = "";
        finalVat = "BE"+currentVat.substring(0,4)+"."+currentVat.substring(4,7)+"."+currentVat.substring(7,10);
    return finalVat;
};

exports.valueMustBeAnInteger = (req, res, doc, mustBeFilledIn = false, message = "VAT percentage is not valid") => {
    let invalid = checkRegex(doc, /([1-9][0-9]{0,100})/,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};

exports.valueMustBePostalCode = (req, res, doc, mustBeFilledIn = false, message = "Postal code is not valid, only Belgian postal codes support for now") => {
    let invalid = checkRegex(doc, /^([1-9][0-9]{3})$/,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};

exports.valueMustBeStreetNumber = (req, res, doc, mustBeFilledIn = false, message = "Street number is not valid, only numbers and letters allowed") => {
    let invalid = this.valueMustBeAName(req,res,doc,mustBeFilledIn,message);
    //let invalid = checkRegex(doc, /^([1-9])([0-9]{0,9}[a-z]{0,3}[A-Z]{0,3})$/,mustBeFilledIn);
    return checkForMessage(req, invalid,message);
};

exports.valueMustBeValidIban = (req, res, doc, mustBeFilledIn = false, message = "IBAN number is not valid") => {
    //Test if only numbers (true)? => put locale client in front of number BE00000000000
    //If (false)? => check for validation below (regex)
    //else test if it contains "." (true)? => remove "." and check above
    if(doc==="" && !mustBeFilledIn){
        return false;
    }else {
        let currentIban = this.formatBEIban(doc);
        const invalid = !IBAN.isValid(currentIban);
        return checkForMessage(req, invalid, message);
    }
};
exports.formatBEIban = (iban) => {
    //format iban number: BE01 2345 6789 0123

    //remove all whitespace
    let currentIban = iban.trim();
    currentIban = currentIban.replace(' ','');
    //remove all letters
    currentIban = currentIban.replace(/[A-Za-z]/g,'');
    //remove all dots (there should be none, but just to be sure)
    currentIban = currentIban.replace(/\.+/g,'');

    //formatting
    let finalIban = "BE"+currentIban.substring(0,2)+" "+currentIban.substring(2,6)+" "+currentIban.substring(6,10)+" "+currentIban.substring(10,14);
    return finalIban;
};
exports.valueMustBeValidBic = (req, res, doc, mustBeFilledIn = false, message = "BIC number is not valid") => {
    if(doc==="" && !mustBeFilledIn){
        return false
    }else{
        let invalid = !ibantools.isValidBIC(doc);
        return checkForMessage(req, invalid,message);
    }
};


let checkForMessage = (req, invalid,message) => {
    if (invalid) {
        req.flash("danger", i18n.__(message));
    }
    return invalid;
};

let checkRegex = (doc="", regex,mustBeFilledIn) => {
    console.log("doc: "+doc);
    doc = String(doc);
    if(doc==="" && !mustBeFilledIn){
        return false;
    }else{
        return (doc.match(regex)) === null;
    }
};

