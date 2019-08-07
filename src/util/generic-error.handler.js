import ContentType from './http-content-type';

const createErrorHandler =
  httpStatusCode =>
    errorMessage =>
      (response, next) => {
        response.status(httpStatusCode);
        response.type(ContentType.JSON);
        response.json({ error: errorMessage });
        next(response);
      };

export default createErrorHandler;
