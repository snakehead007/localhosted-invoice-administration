const logoutController = require('../controllers/logoutController');

exports.stillSignedInCheck = (req,res,next) => {
    if(!req.session.email){
        console.log("[Warning]: not logged in anymore, destroying session & redirect to login");
        return logoutController.logout_get(req,res);
    }
    next();
} ;