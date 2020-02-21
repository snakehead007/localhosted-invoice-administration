//This javascript file has the methods to invalid various forms
const jsvat = require('jsvat');
const IBAN = require('iban');
const ibantools = require('ibantools');
const i18n = require('i18n');
//Method name => [Type]+[invalids when] e.g.valueMustNotBeEmpty(), valueMustBeCorrectZipCode()
//return value: {invalid: true, doc: [given document parameter]}

exports.valueMustNotBeEmpty = (req,res,doc,mustBeFilledIn=false,message="This value must not be empty!") => {
    try {
        let invalid = false;
        if (doc == null) {
            invalid = true;
        }
        //let showMessage = invalid || mustBeFilledIn&&doc==="";
        let showMessage = invalid;
        /*if(!mustBeFilledIn&&doc===""){
            showMessage = false;
        }else if (mustBeFilledIn){
            showMessage = invalid;
        }else{
        }*/
        if (showMessage)
            req.flash('danger', i18n.__(message));
        return showMessage;
    } catch(e){
        req.flash('danger',"something happend");
        res.redirect(err)
    }
};

exports.valueMustBeAName = (req,res,doc,mustBeFilledIn=false,message="This value is invalid, please provide a correct name") => {
    try{

    let invalid = false;
    let regex = /^[a-zA-Z0-9&àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
        let showMessage = invalid;
        /*if(!mustBeFilledIn&&doc===""){
            showMessage = false;
        }else if (mustBeFilledIn){
            showMessage = invalid;
        }else{
        }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidations.valueMustBeAName("+doc+") => "+showMessage);
    return showMessage;
    } catch(e){
        req.flash('danger',"something happend");
        res.redirect(err)
    }
};



exports.valueMustBeEmail = (req,res,doc,mustBeFilledIn=false,message="This value is invalid, please provide a correct email address") => {
    try{
    //A name must only contain [a-z] [A-Z] .
    let invalid = false;
    let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
        let showMessage = invalid;
        /*if(!mustBeFilledIn&&doc===""){
            showMessage = false;
        }else if (mustBeFilledIn){
            showMessage = invalid;
        }else{
        }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeEmail("+doc+") => "+invalid);
    return showMessage} catch(e){
        req.flash('danger',"something happend");
        res.redirect(err)
    }
};

exports.numberMustPhoneNumber = (req,res,doc,mustBeFilledIn=false,message="Phone number is invalid, please provide a correct phone number") => {
    let invalid = false;
    let regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/u;
    let result = doc.match(regex);
    console.log("[DEBUG]: "+ message+": "+result);
    if(result == null){
        invalid = true;
    }
    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeAName("+doc+") => "+invalid);
    return showMessage
};

exports.valueMustBeVatNumber = (req,res,doc,mustBeFilledIn=false,message="VAT number not valid") => {
    console.log(jsvat.checkVAT(doc,jsvat.countries));
    let invalid = !(jsvat.checkVAT(doc,jsvat.countries).isValid);
    let showMessage= invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeVatNumber("+doc+") => "+invalid);
    return showMessage
};

exports.valueMustBeAnInteger = (req,res,doc,mustBeFilledIn=false,message="VAT percentage is not valid") => {
    let invalid = false;
    let regex = /([1-9][0-9]{0,100})/;
    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBePostalCode("+doc+") => "+invalid);
    return showMessage;
};

exports.valueMustBePostalCode = (req,res,doc,mustBeFilledIn=false,message="Postal code is not valid, only Belgian postal codes support for now") => {
    let invalid = false;
    let regex = /^([1-9][0-9]{3})$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }

    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBePostalCode("+doc+") => "+invalid);
    return showMessage
};

exports.valueMustBeStreetNumber = (req,res,doc,mustBeFilledIn=false,message="Street number is not valid, only numbers and letters allowed") => {
    let invalid = false;
    let regex = /^([1-9])([0-9]{0,9}[a-z]{0,3}[A-Z]{0,3})$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true
    }
    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeStreetNumber("+doc+") => "+invalid);
    return showMessage
};

exports.valueMustBeValidIban = (req,res,doc,mustBeFilledIn=false,message="IBAN number is not valid") => {
    //Test if only numbers (true)? => put locale client in front of number BE00000000000
    //If (false)? => check for validation below (regex)
    //else test if it contains '.' (true)? => remove '.' and check above

    const invalid = !IBAN.isValid(doc);
    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/
    if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeValidIban("+doc+") => "+invalid);
    return showMessage
};

exports.valueMustBeValidBic = (req,res,doc,mustBeFilledIn=false,message="BIC number is not valid") => {
    let invalid = !ibantools.isValidBIC(doc);
    let showMessage = invalid;
    /*if(!mustBeFilledIn&&doc===""){
        showMessage = false;
    }else if (mustBeFilledIn){
        showMessage = invalid;
    }else{
    }*/if(showMessage)
        req.flash('danger',i18n.__(message));
    console.log("[DEBUG]: utils.formvalidation.valueMustBeValidBic("+doc+") => "+invalid);
    return showMessage
};
