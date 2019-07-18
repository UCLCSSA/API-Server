import {expect} from 'chai';

import config from 'config';

import server from '../src/index';

describe('Server', () => {
    it('runs on desired port', async () => {
        expect(server.port).to.equal(config.get('port'));
    });
});
