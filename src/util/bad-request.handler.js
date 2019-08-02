import createErrorHandler from './generic-error.handler';

import HttpStatusCode from './http-status-code';

const createBadRequestHandler = createErrorHandler(HttpStatusCode.BAD_REQUEST);

export default createBadRequestHandler;
