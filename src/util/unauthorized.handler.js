import createErrorHandler from './generic-error.handler';

import HttpStatusCode from './http-status-code';

const createUnauthorizedHandler =
  createErrorHandler(HttpStatusCode.UNAUTHORIZED);

export default createUnauthorizedHandler;
