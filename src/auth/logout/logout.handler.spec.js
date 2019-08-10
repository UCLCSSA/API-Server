import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import sinon from 'sinon';

import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

import createLogoutHandler from './logout.handler';

describe('/logout route handler', () => {
  let fakeRequest;
  let fakeResponse;
  let fakeNext;
  let findUserSession;
  let clearUserSession;
  let handler;
  const expirationTimeS = 1;

  beforeEach(() => {
    fakeRequest = {
      header: sinon.fake.returns(null)
    };
    fakeResponse = {
      status: sinon.fake(),
      type: sinon.fake(),
      json: sinon.fake()
    };
    fakeNext = sinon.fake();
    findUserSession = sinon.fake.resolves(false);
    clearUserSession = sinon.fake.resolves(null);
    handler = createLogoutHandler(findUserSession)(clearUserSession)(expirationTimeS);
  });

  it('should return 403 Forbidden for missing Authorization header',
    async () => {
      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.FORBIDDEN))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON)).to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should throw error for missing findUserSession dependency',
    () => {
      expect(
        () => createLogoutHandler(null)(clearUserSession)(0)
      ).to.throw();
    });

  it('should throw error for missing clearUserSession dependency',
    () => {
      expect(
        () => createLogoutHandler(findUserSession)(null)(0)
      ).to.throw();
    });

  it('should return 401 Unauthorized for invalid user session',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves(false);

      handler = createLogoutHandler(findUserSession)(clearUserSession)(expirationTimeS);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON)).to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should call clearUserSession if User Session exists',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves(true);
      clearUserSession = sinon.fake.resolves(null);

      handler = createLogoutHandler(findUserSession)(clearUserSession)(expirationTimeS);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(clearUserSession.calledOnce).to.equal(true);
    });

  it('should return 200 OK if User Session is successfully cleared',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves(true);
      clearUserSession = sinon.fake.resolves(null);

      handler = createLogoutHandler(findUserSession)(clearUserSession)(expirationTimeS);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.OK))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON))
        .to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });

  it('should return 401 Unauthorized if session key is expired',
    async () => {
      fakeRequest = {
        header: sinon.fake.returns('Some-UclcssaSessionKey')
      };

      findUserSession = sinon.fake.resolves(true);
      clearUserSession = sinon.fake.resolves(null);

      handler = createLogoutHandler(findUserSession)(clearUserSession)(-1);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.UNAUTHORIZED))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON))
        .to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });
});
