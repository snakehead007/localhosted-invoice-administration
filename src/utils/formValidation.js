//This javascript file has the methods to invalid various forms
const jsvat = require('jsvat');
const IBAN = require('iban');
const ibantools = require('ibantools');
const i18n = require('i18n');
//Method name => [Type]+[invalids when] e.g.valueMustNotBeEmpty(), valueMustBeCorrectZipCode()
//return value: {invalid: true, doc: [given document parameter]}

exports.valueMustNotBeEmpty = (req,res,doc,message="This value must not be empty!",mustBeFilledIn=false) => {
    let invalid = false;
    if(doc== null){
        invalid = true;
    }
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBeAName = (req,res,doc,message="This value is invalid, please provide a correct name",mustBeFilledIn=false) => {
    //A name must only contain [a-z] [A-Z] .
    let invalid = false;
    //regex from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    let showMessage = (doc !== "" && invalid)||mustBeFilledIn;

    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidations.valueMustBeAName("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};



exports.valueMustBeEmail = (req,res,doc, message="This value is invalid, please provide a correct email address",mustBeFilledIn=false) => {
    //A name must only contain [a-z] [A-Z] .
    let invalid = false;
    let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeEmail("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.numberMustPhoneNumber = (req,res,doc,message="Phone number is invalid, please provide a correct phone number",mustBeFilledIn=false) => {
    let invalid = false;
    let regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/u;
    let result = doc.match(regex);
    console.log("[DEBUG]: "+ message+": "+result);
    if(result == null){
        invalid = true;
    }
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeAName("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBeVatNumber = (req,res,doc, message="VAT number not valid",mustBeFilledIn=false) => {
    console.log(jsvat.checkVAT(doc,jsvat.countries));
    let invalid = !(jsvat.checkVAT(doc,jsvat.countries).isValid);
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeVatNumber("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBePostalCode = (req,res,doc, message="Postal code is not valid, only Belgian postal codes support for now",mustBeFilledIn=false) => {
    let invalid = false;
    let regex = /([1-9][0-9]{3})/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBePostalCode("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBeStreetNumber = (req,res,doc,message="Street number is not valid, only numbers and letters allowed",mustBeFilledIn=false) => {
    let invalid = false;
    let regex = /^([1-9])([0-9]{0,9}[a-z]{0,3}[A-Z]{0,3})$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true
    }
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeStreetNumber("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBeValidIban = (req,res,doc,message="IBAN number is not valid",mustBeFilledIn=false) => {
    const invalid = !IBAN.isValid(doc);
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeValidIban("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};

exports.valueMustBeValidBic = (req,res,doc,message="BIC number is not valid",mustBeFilledIn=false) => {
    let invalid = !ibantools.isValidBIC(doc);
    let showMessage = (doc !== ""||mustBeFilledIn) && invalid;
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeValidBic("+doc+") => "+invalid);
    return (mustBeFilledIn)?showMessage:invalid;
};
