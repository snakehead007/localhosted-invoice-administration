const {sendMessage} = require('../../messages/messages');
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