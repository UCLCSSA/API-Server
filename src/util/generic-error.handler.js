import ContentType from './http-content-type';

const createErrorHandler = httpStatusCode => errorMessage => (res, next) => {
  res.status(httpStatusCode);
  res.type(ContentType.JSON);
  res.json({ message: errorMessage });
  next(res);
};

export default createErrorHandler;
