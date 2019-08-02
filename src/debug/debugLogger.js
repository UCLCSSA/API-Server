import debug from './debug';

const debugLogger = (req, res, next) => {
  debug('=============================');
  debug('[REQUEST headers]');
  debug(req.headers);
  debug('[REQUEST body]');
  debug(req.body);
  debug('=============================');
  next();
};

export default debugLogger;
