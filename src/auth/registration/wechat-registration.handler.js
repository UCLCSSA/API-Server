import debug from '../../debug/debug';

import { isNonEmptyStrings } from '../../util/is-non-empty-string';

import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

import createBadRequestHandler from '../../util/bad-request.handler';
import createUnauthorizedHandler from '../../util/unauthorized.handler';

import createInternalServerErrorHandler
  from '../../util/internal-server-error.handler';
import ErrorType from '../../util/error-type';

const handleMissingKey = createBadRequestHandler(
  ErrorType.BAD_REQUEST.MISSING_REQUIRED_KEYS
);

const handleWechatAuthenticatedFailed = createUnauthorizedHandler(
  ErrorType.UNAUTHORIZED.FAILED_WECHAT_AUTHENTICATION
);

const handleGenerateUclcssaSessionKeyFailed = createInternalServerErrorHandler(
  ErrorType.INTERNAL_SERVER_ERROR.FAILED_UCLCSSA_SESSION_KEY_GENERATION
);

const handleSaveUserSessionFailed = createInternalServerErrorHandler(
  ErrorType.INTERNAL_SERVER_ERROR.FAILED_SAVE_USER_SESSION
);

const createWechatRegistrationHandler =
    authenticateViaWechat =>
      generateUclcssaSessionKey =>
        saveUserSession => {
          const missingDependencies = () =>
            !authenticateViaWechat ||
            !generateUclcssaSessionKey ||
            !saveUserSession;

          if (missingDependencies()) {
            throw Error('Missing dependencies.');
          }

          return async (request, response, next) => {
            try {
              // Missing POST body
              if (!request.body) {
                debug('Missing post body', { request, response, next });
                handleMissingKey(response, next);
                return;
              }

              const { appId, appSecret, code } = request.body;

              // Missing any of required keys
              if (!isNonEmptyStrings([appId, appSecret, code])) {
                debug('Missing key', { appId, appSecret, code });
                handleMissingKey(response, next);
                return;
              }

              // Authenticate via WeChat Auth API
              const authPayload = { appId, appSecret, wechatCode: code };
              const { wechatOpenId, wechatSessionKey } =
                await authenticateViaWechat(authPayload);

              if (!wechatOpenId || !wechatSessionKey) {
                debug('Failed to authenticate via WeChat API.');
                handleWechatAuthenticatedFailed(response, next);
                return;
              }

              // Generate a new uclcssaSessionKey based on WeChat openId and
              // sessionKey.
              const uclcssaSessionKey = await generateUclcssaSessionKey({
                wechatOpenId,
                wechatSessionKey
              });

              if (!uclcssaSessionKey) {
                debug('Failed to generate uclcssaSession.');
                handleGenerateUclcssaSessionKeyFailed(response, next);
                return;
              }

              const saveSuccess = await saveUserSession({
                uclcssaSessionKey,
                wechatOpenId,
                wechatSessionKey,
                uclapiToken: ''
              });

              if (!saveSuccess) {
                debug('Failed to save user session.');
                handleSaveUserSessionFailed(response, next);
                return;
              }

              // Return uclcssaSessionKey to the client. This session key shall
              // be stored and used by the client as proof-of-identity for
              // authorized access to protected routes.
              debug('Saved user session. Returning to client.');
              response.status(HttpStatusCode.OK);
              response.type(ContentType.JSON);
              response.json({ uclcssaSessionKey });
              next();
            } catch (error) {
              next(error);
            }
          };
        };

export default createWechatRegistrationHandler;
