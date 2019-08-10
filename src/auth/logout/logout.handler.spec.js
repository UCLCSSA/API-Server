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
  let clearUserSession;
  let handler;

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
    clearUserSession = sinon.fake.resolves(null);
    handler = createLogoutHandler(clearUserSession);
  });

  it('should throw error for missing clearUserSession dependency',
    () => {
      expect(
        () => createLogoutHandler(null)
      ).to.throw();
    });

  it('should call clearUserSession if User Session exists',
    async () => {
      fakeRequest = {
        locals: { userSession: { uclcssaSessionKey: 'uclcssaSessionKey' } }
      };

      clearUserSession = sinon.fake.resolves(null);

      handler = createLogoutHandler(clearUserSession);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(clearUserSession.calledWith('uclcssaSessionKey'))
        .to.equal(true);
    });

  it('should return 200 OK if User Session is successfully cleared',
    async () => {
      fakeRequest = {
        locals: { userSession: { uclcssaSessionKey: 'uclcssaSessionKey' } }
      };

      clearUserSession = sinon.fake.resolves(null);

      handler = createLogoutHandler(clearUserSession);

      await handler(fakeRequest, fakeResponse, fakeNext);

      expect(fakeResponse.status.calledWith(HttpStatusCode.OK))
        .to.equal(true);
      expect(fakeResponse.type.calledWith(ContentType.JSON))
        .to.equal(true);
      expect(fakeNext.calledOnce).to.equal(true);
    });
});
