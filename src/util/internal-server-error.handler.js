import createErrorHandler from './generic-error.handler';

import HttpStatusCode from './http-status-code';

const createInternalServerErrorHandler =
  createErrorHandler(HttpStatusCode.INTERNAL_SERVER_ERROR);

export default createInternalServerErrorHandler;
