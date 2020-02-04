//This javascript file has the methods to validate various forms

//Method name => [Type]+[validates when] e.g.valueMustNotBeEmpty(), valueMustBeCorrectZipCode()
//return value: {validate: true, doc: [given document parameter]}

exports.valueMustNotBeEmpty = (doc) => {
    let validate = false;
    if(doc==""){
        validate = true;
    }
    return {
        validate:validate,
        doc:doc,
        message:"This value must not be empty!"
    }
};

exports.valueMustBeAName = (doc) => {
    //A name must only contain [a-z] [A-Z] .
    let validate = false;
    //regex from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let result = doc.match(regex);
    if(result!=""){
        validate = true;
    }
    return {validate:validate,
    doc:doc,
    message:"This value is invalid, please provide a correct name"}
};
