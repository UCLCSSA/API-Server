import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';

import HttpStatusCode from '../util/http-status-code';

import createVersioningDispatcher from './versioning.dispatcher';

describe('versioning dispatcher', () => {
  let request;
  let response;
  let next;

  const validMajorVersions = [1, 2];
  const defaultMajorVersion = 1;
  const expectedPrefix = `/v${defaultMajorVersion}`;

  beforeEach(() => {
    request = {
      header: sinon.fake.returns(null),
      originalUrl: '/hello'
    };
    response = {
      status: sinon.fake(),
      type: sinon.fake(),
      json: sinon.fake()
    };
    next = sinon.fake();
  });

  it('should default to given major version if no Content-Type is specified',
    () => {
      const dispatcher =
        createVersioningDispatcher(validMajorVersions)(defaultMajorVersion);

      dispatcher(request, response, next);

      expect(request.url).to.equal(`${expectedPrefix}/hello`);
      expect(next.calledOnce).to.equal(true);
    });

  it('should extract given version number in Content-Type',
    () => {
      const dispatcher =
        createVersioningDispatcher(validMajorVersions)(defaultMajorVersion);

      request.header = sinon.fake.returns('application/vnd.uclcssa.v2+json');

      dispatcher(request, response, next);

      expect(request.url).to.equal(`/v2/hello`);
      expect(next.calledOnce).to.equal(true);
    });

  it('should default to defaultMajorVersion if Content-Type does not specify',
    () => {
      const dispatcher =
        createVersioningDispatcher(validMajorVersions)(defaultMajorVersion);

      request.header = sinon.fake.returns('application/json');

      dispatcher(request, response, next);

      expect(request.url).to.equal(`/v1/hello`);
      expect(next.calledOnce).to.equal(true);
    });

  it('should return 400 Bad Request if invalid version is given',
    () => {
      const dispatcher =
        createVersioningDispatcher(validMajorVersions)(defaultMajorVersion);

      request.header = sinon.fake.returns('application/vnd.uclcssa.v3+json');

      dispatcher(request, response, next);

      expect(response.status.calledWith(HttpStatusCode.BAD_REQUEST));
      expect(next.calledOnce).to.equal(true);
    });
});
