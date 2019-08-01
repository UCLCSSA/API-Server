import HttpStatusCode from './http-status-code';
import ContentType from './http-content-type';

const createBadRequestHandler = errorMessage => (res, next) => {
  res.status(HttpStatusCode.BAD_REQUEST);
  res.type(ContentType.JSON);
  res.json({ message: errorMessage });
  next(res);
};

export default createBadRequestHandler;
