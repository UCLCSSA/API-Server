import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

import createWechatRegistrationHandler from './wechat-registration.handler';

describe('/register/wechat route handler', () => {
  let body;
  let fakeRes;
  let fakeNext;
  let auth;
  let generator;
  let handler;
  let save;

  beforeEach(() => {
    body = null;
    fakeRes = {
      status: sinon.fake(),
      type: sinon.fake(),
      json: sinon.fake()
    };
    fakeNext = sinon.fake();
    auth = sinon.fake();
    generator = sinon.fake();
    save = sinon.fake();
    handler = createWechatRegistrationHandler(auth)(generator)(save);
  });

  it('should return 400 bad request for missing POST body', async () => {
    // If no POST body is supplied by request, req.body is undefined.
    await handler({ }, fakeRes, fakeNext);

    expect(fakeRes.status.calledWith(HttpStatusCode.BAD_REQUEST))
      .to.equal(true);
    expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
    expect(fakeNext.calledOnce).to.equal(true);
  });

  it('should return 400 bad request for missing any key', async () => {
    // Missing code
    body = { appId: 'present', appSecret: 'present' };

    await handler({ body }, fakeRes, fakeNext);

    expect(fakeRes.status.calledWith(HttpStatusCode.BAD_REQUEST))
      .to.equal(true);
    expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
    expect(fakeNext.calledOnce).to.equal(true);
  });

  it('should throw error for missing wechat auth handler',
    () => {
      expect(
        () => createWechatRegistrationHandler(null)(generator)(save)
      ).to.throw();
    });

  it('should throw error for missing uclcssaSessionKey generator',
    () => {
      expect(
        () => createWechatRegistrationHandler(auth)(null)(save)
      ).to.throw();
    });

  it('should throw error for missing db integration',
    () => {
      expect(
        () => createWechatRegistrationHandler(auth)(generator)(null)
      ).to.throw();
    });

  it('should return 401 Unauthorized for failing to authenticate via WeChat',
    async () => {
      body = { appId: 'present', appSecret: 'present', code: 'code' };
      auth = sinon.fake.resolves({ });

      handler = createWechatRegistrationHandler(auth)(generator)(save);

      await handler({ body }, fakeRes, fakeNext);

      expect(fakeRes.status.calledWith(HttpStatusCode.UNAUTHORIZED))
        .to.equal(true);
      expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });
});
