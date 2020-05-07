const i18n = require('i18n');
exports.notAvailable = (req,res) =>{
    req.flash(i18n.__("This is feature is not available yet."));
    res.redirect('back');
};
