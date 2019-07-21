import { expect } from 'chai';
import sinon from 'sinon';

import HttpStatusCode from '../../util/http-status-code';
import ContentType from '../../util/http-content-type';

import createWechatRegistrationHandler from './wechat-registration.handler';

describe('/register route handler', () => {
    let body;
    let fakeRes;
    let fakeNext;

    beforeEach(() => {
        body = null;
        fakeRes = {
            status: sinon.fake(),
            type: sinon.fake(),
            json: sinon.fake(),
        };
        fakeNext = sinon.fake();
    });

    it('should return 400 bad request for missing POST body', async () => {
        // If no POST body is supplied by request, req.body is undefined.
        // eslint-disable-next-line no-undefined
        body = undefined;
        const req = { body };

        await createWechatRegistrationHandler(null)(req, fakeRes, fakeNext);

        expect(fakeRes.status.calledWith(HttpStatusCode.BAD_REQUEST)).to.equal(true);
        expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
        expect(fakeNext.calledOnce).to.equal(true);
    });

    it('should return 400 bad request for missing any key', async () => {
        // Missing code
        body = { appId: 'present', appSecret: 'present' };
        const req = { body };

        await createWechatRegistrationHandler(null)(req, fakeRes, fakeNext);

        expect(fakeRes.status.calledWith(HttpStatusCode.BAD_REQUEST)).to.equal(true);
        expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
        expect(fakeNext.calledOnce).to.equal(true);
    });
});
