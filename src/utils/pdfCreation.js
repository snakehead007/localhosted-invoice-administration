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
        json_data += ("{\"beschrijving\" : \"" + obj[Number(i)].beschrijving + "\", " +
            "\"aantal\" : " + obj[Number(i)].aantal + ", " +
            "\"bedrag\" : " + obj[Number(i)].bedrag + ", " +
            "\"totaal\" : " + Number(obj[Number(i)].aantal * obj[Number(i)].bedrag) + " }");
        if (i <= Number(obj.length) - 2) {
            json_data += ",";
        }
    }
    json_data += "]";
    return json_data;
}