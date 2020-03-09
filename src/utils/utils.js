exports.getIp = (req) => {
    return (req.headers['x-forwarded-for'] || '').split(',').pop() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};