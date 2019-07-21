import { expect } from 'chai';
import sinon from 'sinon';

import HttpStatusCode from './http-status-code';
import ContentType from './http-content-type';

import createBadRequestHandler from './bad-request.handler';

describe('Bad request handler', () => {
    let fakeRes;
    let fakeNext;
    let badRequestHandler;
    const errorMessage = 'BAD REQUEST';

    beforeEach(() => {
        fakeRes = {
            status: sinon.fake(),
            type: sinon.fake(),
            json: sinon.fake(),
        };
        fakeNext = sinon.fake();
        badRequestHandler = createBadRequestHandler(errorMessage);
    });

    it('should return 400 Bad Request status code', () => {
        badRequestHandler(fakeRes, fakeNext);
        expect(fakeRes.status.calledWith(HttpStatusCode.BAD_REQUEST)).to.equal(true);
    });

    it('should return application/json Content-Type header', () => {
        badRequestHandler(fakeRes, fakeNext);
        expect(fakeRes.type.calledWith(ContentType.JSON)).to.equal(true);
    });

    it('should return specified error message', () => {
        badRequestHandler(fakeRes, fakeNext);
        expect(fakeRes.json.args[0][0])
            .to.deep.equal({ message: errorMessage });
    });

    it('should delegate error handling to next handler (Express)', () => {
        badRequestHandler(fakeRes, fakeNext);
        expect(fakeNext.calledOnce).to.equal(true);
    });
});
