import debug from '../../debug/debug';

import { isNonEmptyStrings } from '../../util/is-non-empty-string';

import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

import createBadRequestHandler from '../../util/bad-request.handler';
import createInternalServerErrorHandler
  from '../../util/internal-server-error.handler';

const handleMissingPostBody = createBadRequestHandler(
  'Bad request: missing { appId, appSecret, code }.'
);

const handleMissingKey = createBadRequestHandler(
  'Bad request: missing one or more of { appId, appSecret, code }.'
);

const handleWechatAuthenticatedFailed = createBadRequestHandler(
  'Bad request: failed to authenticate via WeChat.'
);

const handleGenerateUclcssaSessionKeyFailed = createInternalServerErrorHandler(
  'Internal server error: failed to generate uclcssaSessionKey.'
);

const handleSaveUserSessionFailed = createInternalServerErrorHandler(
  'Internal server error: failed to persist user session.'
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
                handleMissingPostBody(response, next);
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
