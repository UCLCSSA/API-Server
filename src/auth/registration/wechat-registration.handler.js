import { isNonEmptyStrings } from '../../util/is-non-empty-string';
import createBadRequestHandler from '../../util/bad-request.handler';
import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

const handleMissingPostBody = createBadRequestHandler('Bad request: missing { appId, appSecret, code }.');

const handleMissingKey = createBadRequestHandler('Bad request: missing one or more of { appId, appSecret, code }.');

const createWechatRegistrationHandler = WechatService => async (req, res, next) => {
    // Missing POST body
    if (!req.body) {
        handleMissingPostBody(res, next);
        return;
    }

    const { appId, appSecret, code } = req.body;

    // Missing any of required keys
    if (!isNonEmptyStrings([ appId, appSecret, code ])) {
        handleMissingKey(res, next);
        return;
    }

    // Try to authenticate via WeChat Auth API
    const authPayload = { appId, appSecret, code };
    const { uclcssaToken, sessionKey, openId } = await WechatService.authenticate(authPayload);

    /*
     * Return uclcssaToken to the client. This token shall be stored and used
     * by the client as proof-of-identity for authorized access to protected
     * routes.
     */
    res.status(HttpStatusCode.OK);
    res.type(ContentType.JSON);
    res.json({ uclcssaToken });
};

export default createWechatRegistrationHandler;
