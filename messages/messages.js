const i18n = require('i18n');
const fs = require('fs');
const path = require('path');
exports.getMessage = async (req, res, enr=0) => {
    let messages;
    try{
        let _path = path.resolve(__dirname,'./messages.json');
        messages = JSON.parse(fs.readFileSync(_path, 'utf8'));
        console.log(messages);
        return {
            message: i18n.__(messages[enr].message),
            type: messages[enr].type
        }
    }catch(e){
        console.trace(e);
    }
};

exports.sendMessage = (req,res,enr) => {
    const o = this.getMessage(req,res,enr);
    console.log(o);
    req.flash(o.type,o.message);
};