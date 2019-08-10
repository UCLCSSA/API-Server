import moment from 'moment';

import RegistrationTier from '../registration-tier';

import ErrorType from '../../../util/error-type';

import isSessionExpired from './is-session-expired';

import createAccessForbiddenHandler from '../../../util/access-forbidden.handler';
import createUnauthorizedHandler from '../../../util/unauthorized.handler';

import { isNonEmptyString } from '../../../util/is-non-empty-string';

const isValidTier = tier => Object.values(RegistrationTier).includes(tier);

const handleMissingAuthorizationHeader = createAccessForbiddenHandler(
  ErrorType.FORBIDDEN.MISSING_AUTHORIZATION_HEADER
);

const handleInvalidSessionKey = createUnauthorizedHandler(
  ErrorType.UNAUTHORIZED.INVALID_UCLCSSA_SESSION_KEY
);

const handleExpiredSessionKey = createUnauthorizedHandler(
  ErrorType.UNAUTHORIZED.EXPIRED_UCLCSSA_SESSION_KEY
);

const handleMissingWechatRegistration = createUnauthorizedHandler(
  ErrorType.UNAUTHORIZED.WECHAT_UNREGISTERED
);

const handleMissingUclapiRegistration = createUnauthorizedHandler(
  ErrorType.UNAUTHORIZED.UCLAPI_UNREGISTERED
);

// Authorization middleware. Checks whether the user has a valid
// uclcssaSessionKey, with the required registration tier.
const createRegistrationTierValidator =
  findUserSessionBySessionKey =>
    (expirationTimeS = 2592000) =>
      tier => {
        if (!findUserSessionBySessionKey) {
          throw new Error('Missing findUserSession dependency.');
        }

        if (!isValidTier(tier)) {
          throw new Error('Invalid registration tier.');
        }

        return async (request, response, next) => {
          const uclcssaSessionKey = request.header('Authorization');

          // Missing Authorization header.
          if (!uclcssaSessionKey) {
            handleMissingAuthorizationHeader(response, next);
            return;
          }

          const userSession =
            await findUserSessionBySessionKey(uclcssaSessionKey);

          // If supplied uclcssaSessionKey does not exist in records, we return
          // 401 Unauthorized.
          if (!userSession) {
            handleInvalidSessionKey(response, next);
            return;
          }

          const { lastUsed } = userSession;

          const lastUsedDatetime = moment(lastUsed);
          const currentDatetime = moment();

          // Ensure uclcssaSessionKey has not expired.
          if (
            isSessionExpired(expirationTimeS)(lastUsedDatetime, currentDatetime)
          ) {
            handleExpiredSessionKey(response, next);
            return;
          }

          const {
            wechatSessionKey,
            uclapiToken
          } = userSession;

          // If wechat-registered tier is required, but no wechat sessionKey is
          // found, then we return 401 Unauthorized.
          if (tier === RegistrationTier.WECHAT_REGISTERED &&
            !isNonEmptyString(wechatSessionKey)) {
            handleMissingWechatRegistration(response, next);
            return;
          }

          // If uclapi-registered tier is required, but no wechat sessionKey is
          // found, then we return 401 Unauthorized.
          if (tier === RegistrationTier.UCLAPI_REGISTERED &&
            !isNonEmptyString(uclapiToken)) {
            handleMissingUclapiRegistration(response, next);
            return;
          }

          // We propagate uclcssaSessionKey, wechatSessionKey and
          // uclapiToken for route handlers to use, should they exist.
          request.locals.userSession = { uclcssaSessionKey };

          if (isNonEmptyString(wechatSessionKey)) {
            /* eslint require-atomic-updates:0 */
            request.locals.userSession.wechatSessionKey = wechatSessionKey;
          }

          if (isNonEmptyString(uclapiToken)) {
            /* eslint require-atomic-updates:0 */
            request.locals.userSession.uclapiToken = uclapiToken;
          }

          next();
        };
      };

export default createRegistrationTierValidator;
