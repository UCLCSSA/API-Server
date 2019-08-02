import { describe, it, beforeEach } from 'mocha';
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import authenticateViaWechat from './authenticate-via-wechat';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('authenticateViaWechat', () => {
  let axios;
  let appId;
  let appSecret;
  let wechatCode;

  beforeEach(() => {
    axios = {
      get: sinon.fake.returns({
        data: {},
        status: 200
      })
    };

    appId = 'abc';
    appSecret = 'def';
    wechatCode = 'ghi';
  });

  it('should throw error if missing auth details', () => {
    expect(authenticateViaWechat(axios)({ })).to.eventually.be.rejectedWith(Error);
  });

  it('should throw error if auth details are empty strings',
    () => {
      appId = '';
      appSecret = '';
      wechatCode = '';
      expect(authenticateViaWechat(axios)({
        appId, appSecret, wechatCode
      })).to.eventually.be.rejectedWith(Error);
    });

  it('should make request to correct wechat auth api url', async () => {
    await authenticateViaWechat(axios)({ appId, appSecret, wechatCode });

    expect(
      axios.get.calledWith('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: appId,
          secret: appSecret,
          js_code: wechatCode,
          grant_type: 'authorization_code'
        }
      })
    ).to.equal(true);
  });

  it('should return empty object upon 4XX errors', async () => {
    axios.get = async () => Promise.resolve({
      data: {},
      status: 403,
      statusText: 'Forbidden'
    });

    const response = await authenticateViaWechat(axios)({
      appId, appSecret, wechatCode
    });

    expect(response).to.deep.equal({ });
  });

  it('should return empty object upon 5XX errors', async () => {
    axios.get = async () => Promise.resolve({
      data: {},
      status: 500,
      statusText: 'Internal server error'
    });

    const response = await authenticateViaWechat(axios)({
      appId, appSecret, wechatCode
    });

    expect(response).to.deep.equal({ });
  });

  it('should return empty object upon wechat API returning non-zero status' +
    ' code', async () => {
    axios.get = async () => Promise.resolve({
      data: {
        errcode: -1
      },
      status: 200,
      statusText: 'OK'
    });

    const response = await authenticateViaWechat(axios)({
      appId, appSecret, wechatCode
    });

    expect(response).to.deep.equal({ });
  });

  it('should return wechat openId and sessionKey upon wechat API returning' +
    ' 0 status code', async () => {
    axios.get = async () => Promise.resolve({
      data: {
        errcode: 0,
        errmsg: '',
        openid: '123456',
        session_key: 'abcdef'
      },
      status: 200,
      statusText: 'OK'
    });

    const response = await authenticateViaWechat(axios)({
      appId, appSecret, wechatCode
    });

    expect(response).to.deep.equal({
      wechatOpenId: '123456',
      wechatSessionKey: 'abcdef'
    });
  });
});
