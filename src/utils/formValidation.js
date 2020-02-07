//This javascript file has the methods to invalid various forms
const jsvat = require('jsvat');
const IBAN = require('iban');
const ibantools = require('ibantools');
//Method name => [Type]+[invalids when] e.g.valueMustNotBeEmpty(), valueMustBeCorrectZipCode()
//return value: {invalid: true, doc: [given document parameter]}

exports.valueMustNotBeEmpty = (doc,message="This value must not be empty!") => {
    let invalid = false;
    if(doc== null){
        invalid = true;
    }
    return {
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBeAName = (doc,message="This value is invalid, please provide a correct name") => {
    //A name must only contain [a-z] [A-Z] .
    let invalid = false;
    //regex from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidations.valueMustBeAName("+doc+") => "+invalid);
    return {invalid:invalid,
    doc:doc,
    message:message}
};



exports.valueMustBeEmail = (doc, message="This value is invalid, please provide a correct email address") => {
    //A name must only contain [a-z] [A-Z] .
    let invalid = false;
    let regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBeEmail("+doc+") => "+invalid);
    return {invalid:invalid,
        doc:doc,
        message:message}
};

exports.numberMustPhoneNumber = (doc,message="Phone number is invalid, please provide a correct phone number") => {
    let invalid = false;
    let regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/u;
    let result = doc.match(regex);
    console.log("[DEBUG]: "+ message+": "+result);
    if(result == null){
        invalid = true;
    }

    if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBeAName("+doc+") => "+invalid);
    return {
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBeVatNumber = (doc, message="VAT number not valid") => {
    console.log(jsvat.checkVAT(doc,jsvat.countries));
    let invalid = !(jsvat.checkVAT(doc,jsvat.countries).isValid);
    if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBeVatNumber("+doc+") => "+invalid);
    return {
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBePostalCode = (doc, message="Postal code is not valid, only Belgian postal codes support for now") => {
    let invalid = false;
    let regex = /([1-9][0-9]{3})/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true;
    }
    if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBePostalCode("+doc+") => "+invalid);
    return {
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBeStreetNumber = (doc,message="Street number is not valid, only numbers and letters allowed") => {
    let invalid = false;
    let regex = /^([1-9])([0-9]{0,9}[a-z]{0,3}[A-Z]{0,3})$/;
    let result = doc.match(regex);
    if(result == null){
        invalid = true
    }
    //if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBeStreetNumber("+doc+") => "+invalid);
    return{
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBeValidIban = (doc,message="IBAN number is not valid") => {
    const invalid = !IBAN.isValid(doc);
   // if(process.env.DEBUG_MESSAGES)
        console.log("[DEBUG]: utils.formvalidation.valueMustBeValidIban("+doc+") => "+invalid);
    return{
        invalid:invalid,
        doc:doc,
        message:message
    }
};

exports.valueMustBeValidBic = (doc,message="BIC number is not valid") => {
    let invalid = !ibantools.isValidBIC(doc);
       console.log("[DEBUG]: utils.formvalidation.valueMustBeValidBic("+doc+") => "+invalid);
    return{
        invalid:invalid,
        doc:doc,
        message:message
    }
};
