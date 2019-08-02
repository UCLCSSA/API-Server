import debug from '../../../debug/debug';

import { isNonEmptyStrings } from '../../../util/is-non-empty-string';

// Error handling here relies on returning { } instead of throwing errors.

const authenticateViaWechat = axios =>
  async ({ appId, appSecret, wechatCode }) => {
    if (!appId || !appSecret || !wechatCode) {
      debug('Missing appId, appSecret or wechatCode.');
      return { };
    }

    if (!isNonEmptyStrings([appId, appSecret, wechatCode])) {
      debug('One or more of appId, appSecret or wechatCode is empty.');
      return { };
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
        debug(status);
        return { };
      }

      if (data.errcode) {
        const errorCode = data.errcode;
        const errorMessage = data.errmsg;
        debug(errorCode);
        debug(errorMessage);
        return { };
      }

      return { wechatOpenId: data.openid, wechatSessionKey: data.session_key };
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        debug(error.response.data);
        debug(error.response.status);
        debug(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        debug(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        debug('Error', error.message);
      }
    }
  };

export default authenticateViaWechat;
