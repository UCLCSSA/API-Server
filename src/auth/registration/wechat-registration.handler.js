import { isNonEmptyStrings } from '../../util/is-non-empty-string';
import createBadRequestHandler from '../../util/bad-request.handler';
import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

const handleMissingPostBody = createBadRequestHandler(
  'Bad request: missing { appId, appSecret, code }.'
);

const handleMissingKey = createBadRequestHandler(
  'Bad request: missing one or more of { appId, appSecret, code }.'
);

const handleWechatAuthenticatedFailed = createBadRequestHandler(
  'Bad request: failed to authenticated via WeChat.'
);

const handleGenerateUclcssaSessionKeyFailed = createBadRequestHandler(
  'Internal server error: failed to generate uclcssaSessionKey.'
);

const createWechatRegistrationHandler =
    authenticateViaWechat =>
      generateUclcssaSessionKey =>
        async (request, response, next) => {
          // Missing POST body
          if (!request.body) {
            handleMissingPostBody(response, next);
            return;
          }

          const { appId, appSecret, code } = request.body;

          // Missing any of required keys
          if (!isNonEmptyStrings([appId, appSecret, code])) {
            handleMissingKey(response, next);
            return;
          }

          // Authenticate via WeChat Auth API
          const authPayload = { appId, appSecret, code };
          const { wechatOpenId, wechatSessionKey } =
            await authenticateViaWechat(authPayload);

          if (!wechatOpenId || !wechatSessionKey) {
            handleWechatAuthenticatedFailed(response, next);
            return;
          }

          // Generate a new uclcssaSessionKey based on WeChat openId and
          // sessionKey.
          const uclcssaSessionKey = generateUclcssaSessionKey({
            wechatOpenId,
            wechatSessionKey
          });

          if (!uclcssaSessionKey) {
            handleGenerateUclcssaSessionKeyFailed(response, next);
            return;
          }

          // Return uclcssaSessionKey to the client. This session key shall
          // be stored and used by the client as proof-of-identity for
          // authorized access to protected routes.
          response.status(HttpStatusCode.OK);
          response.type(ContentType.JSON);
          response.json({ uclcssaSessionKey });
        };

export default createWechatRegistrationHandler;
