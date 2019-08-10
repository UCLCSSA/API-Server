import { describe, it } from 'mocha';
import { expect } from 'chai';
import isSessionExpired from './is-session-expired';

import moment from 'moment';

describe('isSessionExpired (seconds)', () => {
  it('should return true for expired session', () => {
    const expirationTimeS = 1;
    const lastUsed = moment('2019-01-01 00:00:00');
    const currentDatetime = moment('2019-01-01 00:00:02');

    expect(isSessionExpired(expirationTimeS)(lastUsed, currentDatetime))
      .to.equal(true);
  });

  it('should return false for valid session', () => {
    const expirationTimeS = 3;
    const lastUsed = moment('2019-01-01 00:00:00');
    const currentDatetime = moment('2019-01-01 00:00:03');

    expect(isSessionExpired(expirationTimeS)(lastUsed, currentDatetime))
      .to.equal(false);
  });
});
