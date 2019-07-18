const debug = require('debug')('server:debug');

const debugLogger = (req, res, next) => {
    debug('========= <REQ/RES> =========');
    debug('[REQUEST headers]');
    debug(req.headers);
    debug('[REQUEST body]');
    debug(req.body);
    debug('---------');
    debug('[RESPONSE headers]');
    debug(res.headers);
    debug('[RESPONSE body]');
    debug(res.body);
    debug('=============================');
    next();
};

export default debugLogger;
