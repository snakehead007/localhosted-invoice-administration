const winston = require('winston');
const consoleTransport = new winston.transports.Console();
const myWinstonOptions = {
    transports: [consoleTransport]
};
let logger;
function logRequest(req, res, next) {
    logger.info(req.url);
    next()
}

function logError(err, req, res, next) {
    logger.error(err);
    next()
}
exports.default = (app) => {
    logger = new winston.createLogger(myWinstonOptions);
    app.use(logRequest);
    app.use(logError);
};

