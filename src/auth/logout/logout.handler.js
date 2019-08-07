import createBadRequestHandler from '../../util/bad-request.handler';
import createAccessForbiddenHandler from '../../util/access-forbidden.handler';

import ErrorType from '../../util/error-type';

const handleMissingAuthorizationHeader = createBadRequestHandler(
  ErrorType.BAD_REQUEST.MISSING_AUTHORIZATION_HEADER
);

const handleInvalidSessionKey = createAccessForbiddenHandler(
  ErrorType.FORBIDDEN.INVALID_UCLCSSA_SESSION_KEY
);

const createLogoutHandler =
  findUserSessionBySessionKey =>
    clearUserSession => {
      const missingDependencies =
        () => !findUserSessionBySessionKey || !clearUserSession;

      if (missingDependencies()) {
        throw Error('Missing dependencies.');
      }

      return async (request, response, next) => {
        try {
          const sessionKey = request.header('Authorization');

          // Missing Authorization header.
          if (!sessionKey) {
            handleMissingAuthorizationHeader(response, next);
            return;
          }

          const sessionExists = await findUserSessionBySessionKey(sessionKey);

          // If supplied uclcssaSessionKey does not exist in records, we return
          // 403 Forbidden.
          if (!sessionExists) {
            handleInvalidSessionKey(response, next);
            return;
          }

          // We clear associated wechat sessionKey and uclapi token with the
          // given uclcssaSessionKey. This invalidates the user session.
          await clearUserSession(sessionKey);

          // We simply send 200 OK if logging out is successful.
          response.status(200);
          response.end();
          next();
        } catch (error) {
          next(error);
        }
      };
    };

export default createLogoutHandler;