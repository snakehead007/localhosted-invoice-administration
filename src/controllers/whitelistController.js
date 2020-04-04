const Whitelist = require('../models/whitelist');
const logger = require("../middlewares/logger");
const {getIp} = require("../utils/utils");
const Error = require('../middlewares/error');
/**
 * @apiVersion 3.0.0
 * @api {get} /whitelist/:secret/:mail addToWhitelist
 * @apiParam {String} secret unique secret string
 * @apiParam {String} mail email to whitelist
 * @apiParamExample {String} mail:
    "mail": test@test.test
 * @apiDescription Adds an email to the whitelist list on the server
 * @apiName addToWhitelist
 * @apiGroup WhitelistRouter
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
    "success"
 * @apiErrorExample Failed-Response:
 *  HTTP/1.1 200 OK
   "failed"
 @apiErrorExample Error-Response:
 *  HTTP/1.1 200 OK
    "error"
 */
exports.addToWhitelist = async (req, res) => {
    if (req.params.secret === process.env.ADMIN_SECRET) {
        let newWhitelist = new Whitelist({
            mail: req.params.mail
        });
        await newWhitelist.save((err) => {
            if (err) {
                Error.handler(req,res,err,'GW0000','','NO_REDIRECT');
                res.send('error');
            } else {
                logger.info.log("[INFO]: email "+req.params.mail+" added to the whitelist");
                res.send('success');
            }
        });
    } else {
        logger.info.log("[WARNING]: Failed to give right secret. Ip: "+getIp(req)+" has session: "+((req.session)?req.session:"no session found"));
        res.send('failed');
    }
};