import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import moment from 'moment';

import HttpStatusCode from '../../../util/http-status-code';
import ContentType from '../../../util/http-content-type';

import RegistrationTier from '../registration-tier';

import createRegistrationTierValidator from './create-registration-tier.validator';

describe('requireRegistrationTierValidator middleware', () => {
  let fakeRequest;
  let fakeResponse;
  let fakeNext;
  let findUserSession;
  let tier;
  let validator;
  let expirationTimeS;

  beforeEach(() => {
    fakeRequest = {
      header: sinon.fake.returns(null),
      locals: { }
    };
    fakeResponse = {
      status: sinon.fake(),
      type: sinon.fake(),
      json: sinon.fake()
    };
    tier = RegistrationTier.WECHAT_REGISTERED;
    fakeNext = sinon.fake();
    findUserSession = sinon.fake.resolves(null);
    expirationTimeS = 1;
    validator = createRegistrationTierValidator(findUserSession)(expirationTimeS)(tier);
  });

  it('should return 403 Forbidden for missing Authorization header',
    async () => {
      await validator(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.FORBIDDEN))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON)).to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should throw error for missing findUserSession dependency',
    () => {
      expect(
        () => createRegistrationTierValidator(null)(expirationTimeS)(tier)
      ).to.throw();
    });

  it('should return 401 Unauthorized for invalid user session',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves(null);

      validator = createRegistrationTierValidator(findUserSession)(expirationTimeS)(tier);

      await validator(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON)).to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should return 401 Unauthorized if session key is expired',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves({
        uclcssaSessionKey: 'uclcssaSessionKey',
        wechatOpenId: 'wechatOpenId',
        wechatSessionKey: 'wechatSessionKey',
        createdDatetime: moment().toDate(),
        lastUsed: moment().toDate()
      });

      validator = createRegistrationTierValidator(findUserSession)(-1)(tier);

      await validator(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON))
        .to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should return 401 Unauthorized if wechat-registered required but' +
    ' missing wechatSessionKey',
  async () => {
    fakeRequest = {
      header: sinon.fake.returns('Some-UclcssaSessionKey')
    };

    findUserSession = sinon.fake.resolves({
      uclcssaSessionKey: 'uclcssaSessionKey',
      wechatOpenId: 'wechatOpenId',
      wechatSessionKey: '',
      uclapiToken: '',
      createdDatetime: moment().toDate(),
      lastUsed: moment().toDate()
    });

    validator = createRegistrationTierValidator(findUserSession)(100000000)(RegistrationTier.WECHAT_REGISTERED);

    await validator(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
      .to.equal(true);
    expect(fakeResponse.type.calledWith(ContentType.JSON))
      .to.equal(true);
    expect(fakeNext.calledOnce).to.equal(true);
  });

  it('should return 401 Unauthorized if uclapi-registered required but' +
    ' missing uclapiToken',
  async () => {
    fakeRequest = {
      header: sinon.fake.returns('Some-UclcssaSessionKey')
    };

    findUserSession = sinon.fake.resolves({
      uclcssaSessionKey: 'uclcssaSessionKey',
      wechatOpenId: 'wechatOpenId',
      wechatSessionKey: '',
      uclapiToken: '',
      createdDatetime: moment().toDate(),
      lastUsed: moment().toDate()
    });

    validator = createRegistrationTierValidator(findUserSession)(100000000)(RegistrationTier.UCLAPI_REGISTERED);

    await validator(fakeRequest, fakeResponse, fakeNext);

    expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
      .to.equal(true);
    expect(fakeResponse.type.calledWith(ContentType.JSON))
      .to.equal(true);
    expect(fakeNext.calledOnce).to.equal(true);
  });

  it('should pass on user session information to next middleware',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('UclcssaSessionKey'),
        locals: { }
      };

      findUserSession = sinon.fake.resolves({
        uclcssaSessionKey: 'uclcssaSessionKey',
        wechatOpenId: 'wechatOpenId',
        wechatSessionKey: 'wechatSessionKey',
        uclapiToken: 'uclapiToken',
        createdDatetime: moment().toDate(),
        lastUsed: moment().toDate()
      });

      validator = createRegistrationTierValidator(findUserSession)(100000000)(RegistrationTier.UCLAPI_REGISTERED);

      await validator(fakeRequest, fakeResponse, fakeNext);

      expect(fakeRequest.locals.userSession).deep.equals({
        uclcssaSessionKey: 'UclcssaSessionKey',
        wechatSessionKey: 'wechatSessionKey',
        uclapiToken: 'uclapiToken'
      });
      expect(fakeNext.calledOnce).to.equal(true);
    });
});
