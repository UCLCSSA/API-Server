import ContentType from './http-content-type';

const createErrorHandler =
  httpStatusCode =>
    errorType =>
      (response, next) => {
        response.status(httpStatusCode);
        response.type(ContentType.JSON);
        response.json({ error: errorType });
        next(response);
      };

export default createErrorHandler;
