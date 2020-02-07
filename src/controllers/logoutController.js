/**
 * @module controller/logoutController
 */

/**
 *
 * @param req
 * @param res
 */
exports.logout_get = (req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
};