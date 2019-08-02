import debug from '../../../debug/debug';

import { isNonEmptyStrings } from '../../../util/is-non-empty-string';

const authenticateViaWechat = axios =>
  async ({ appId, appSecret, wechatCode }) => {
    if (!appId || !appSecret || !wechatCode) {
      throw Error('Missing wechat auth details.');
    }

    if (!isNonEmptyStrings([appId, appSecret, wechatCode])) {
      throw Error('Wechat auth details may not be empty strings.');
    }

    try {
      const response = await axios.get(
        'https://api.weixin.qq.com/sns/jscode2session', {
          params: {
            appid: appId,
            secret: appSecret,
            js_code: wechatCode,
            grant_type: 'authorization_code'
          }
        });

      const { data, status } = response;

      if (status !== 200) {
        return {};
      }

      const wechatOpenId = data.openid;
      const wechatSessionKey = data.session_key;
      const errorCode = data.errcode;

      if (errorCode !== 0) {
        return {};
      }

      return { wechatOpenId, wechatSessionKey };
    } catch (error) {
      debug(error);
      return {};
    }
  };

export default authenticateViaWechat;
