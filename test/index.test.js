import config from 'config';
import { expect } from 'chai';
import server from '../src/index';

describe('Server', () => {
    it('runs on desired port', () => {
        expect(server.port).to.equal(config.get('port'));
    });
});
