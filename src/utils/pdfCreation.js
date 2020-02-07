const fs = require('fs');
var imageToBase64 = require('image-to-base64');
module.exports.callGetBase64 = async () => {
    var imgData = await (getBase64());
    return imgData
};

let getBase64 = () => {
    return new Promise((resolve,reject) => {
        let path = 'public/logo.jpeg';
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                //BASE64 image if no logo is uploaded
                resolve("data:image/png;base64,iVBORw0KGgoAAAANSUhsEUgAAASwAAACWCAYAAABkW7XSAAAAxUlEQVR4nO3BMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII=");
                return;
            }else{
                imageToBase64(path).then((response) => {
                    let imgData ="data:image/jpeg;base64,";
                    imgData +=response;
                    resolve(imgData);
                }).catch((err) =>{

                });
            }});
    });
};

module.exports.createJSON = function createJSON(obj){
    let json_data = "[";
    for (let i = 0; i <= Number(obj.length) - 1; i++) {
        json_data += ("{\"description\" : \"" + obj[Number(i)].description + "\", " +
            "\"amount\" : " + obj[Number(i)].amount + ", " +
            "\"price\" : " + obj[Number(i)].price + ", " +
            "\"total\" : " + Number(obj[Number(i)].amount * obj[Number(i)].price) + " }");
        if (i <= Number(obj.length) - 2) {
            json_data += ",";
        }
    }
    json_data += "]";
    return json_data;
};

module.exports.replaceAll = (_str,profile,client,invoice,language) => {
    let date = new Date();
    let res;
    let str = String(_str);
    res = str.replace("[firm]",profile.firm);
    res = str.replace("[firma]",profile.firm);

    res = res.replace("[mail]",profile.mail);

    res = res.replace("[name]",profile.name);
    res = res.replace("[naam]",profile.name);

    res = res.replace("[street]",profile.street);
    res = res.replace("[straat]",profile.street);

    res = res.replace("[nr]",profile.streetNr);

    res = res.replace("[postal]",profile.postal);
    res = res.replace("[postcode]",profile.postal);

    res = res.replace("[place]",profile.place);
    res = res.replace("[plaats]",profile.place);

    res = res.replace("[vat]",profile.vat);
    res = res.replace("[btw]",profile.vat);

    res = res.replace("[iban]",profile.iban);

    res = res.replace("[bic]",profile.bic);

    res = res.replace("[tel]",profile.tel);

    res = res.replace("[contact.rekeningnr]",client.bankNr);
    res = res.replace("[contact.bank]",client.bankNr);

    res = res.replace("[factuur.nr]",invoice.invoiceNr);
    res = res.replace("[invoice.nr]",invoice.invoiceNr);

    res = res.replace("[factuur.datum]",invoice.date);
    res = res.replace("[invoice.date]",invoice.date);

    res = res.replace("[date]",Date.now());
    res = res.replace("[datum]",Date.now());


    res = res.replace("[date.d]",date.getDate());
    res = res.replace("[datum.d]",date.getDate());

    res = res.replace("[invoice.advance]",invoice.advance.toFixed(2)+" €");
    res = res.replace("[factuur.voorschot]",invoice.advance.toFixed(2)+" €");

    res = res.replace("[invoice.total]",invoice.total.toFixed(2)+" €");
    res = res.replace("[factuur.totaal]",invoice.total.toFixed(2)+" €");
    return res.split('\r\n');
};