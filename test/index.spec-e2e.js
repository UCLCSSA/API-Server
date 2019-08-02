import { describe, it } from 'mocha';
import { expect } from 'chai';

import config from '../src/config/config';

import server from '../src';

describe('Server', () => {
  it('runs on desired port', () => {
    expect(server.port).to.equal(config.get('port'));
  });
});
