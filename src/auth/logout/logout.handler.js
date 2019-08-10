import moment from 'moment';

import ErrorType from '../../util/error-type';
import ContentType from '../../util/http-content-type';

import createBadRequestHandler from '../../util/bad-request.handler';
import createAccessForbiddenHandler from '../../util/access-forbidden.handler';

import isSessionExpired from '../common/is-session-expired';

const handleMissingAuthorizationHeader = createBadRequestHandler(
  ErrorType.BAD_REQUEST.MISSING_AUTHORIZATION_HEADER
);

const handleInvalidSessionKey = createAccessForbiddenHandler(
  ErrorType.FORBIDDEN.INVALID_UCLCSSA_SESSION_KEY
);

const handleExpiredSessionKey = createAccessForbiddenHandler(
  ErrorType.FORBIDDEN.EXPIRED_UCLCSSA_SESSION_KEY
);

const createLogoutHandler =
  findUserSessionBySessionKey =>
    clearUserSession =>
      (expirationTimeS = 2592000) => {
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

            const userSession = await findUserSessionBySessionKey(sessionKey);

            // If supplied uclcssaSessionKey does not exist in records, we return
            // 403 Forbidden.
            if (!userSession) {
              handleInvalidSessionKey(response, next);
              return;
            }

            const { lastUsed } = userSession;

            const lastUsedDatetime = moment(lastUsed);
            const currentDatetime = moment();

            // Ensure uclcssaSessionKey is still valid.
            if (
              isSessionExpired(expirationTimeS)(lastUsedDatetime, currentDatetime)
            ) {
              handleExpiredSessionKey(response, next);
              return;
            }

            // We clear associated wechat sessionKey and uclapi token with the
            // given uclcssaSessionKey. This invalidates the user session.
            await clearUserSession(sessionKey);

            // We simply send 200 OK if logging out is successful.
            response.status(200);
            response.type(ContentType.JSON);
            response.end();
            next();
          } catch (error) {
            next(error);
          }
        };
      };

export default createLogoutHandler;
