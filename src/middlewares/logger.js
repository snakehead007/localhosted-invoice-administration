exports.logger = require('logzio-nodejs').createLogger({
    token: procces.env.LOGZIO_TOKEN
});