import createErrorHandler from './generic-error.handler';

import HttpStatusCode from './http-status-code';

const createAccessForbiddenHandler =
  createErrorHandler(HttpStatusCode.FORBIDDEN);

export default createAccessForbiddenHandler;
