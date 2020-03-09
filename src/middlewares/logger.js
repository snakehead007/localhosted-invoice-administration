
exports.request = require('logzio-nodejs').createLogger({
    token: process.env.LOGZIO_TOKEN,
    host: process.env.LOGZIO_HOST,
    protocol: 'https',
    port:"8071",
    type:"request"
});

exports.info = require('logzio-nodejs').createLogger({
    token: process.env.LOGZIO_TOKEN,
    host: process.env.LOGZIO_HOST,
    protocol: 'https',
    port:"8071",
    type:"info"
});

exports.warning = require('logzio-nodejs').createLogger({
    token: process.env.LOGZIO_TOKEN,
    host: process.env.LOGZIO_HOST,
    protocol: 'https',
    port:"8071",
    type:"warning"
});

exports.error = require('logzio-nodejs').createLogger({
    token: process.env.LOGZIO_TOKEN,
    host: process.env.LOGZIO_HOST,
    protocol: 'https',
    port:"8071",
    type:"error"
});

module.exports;