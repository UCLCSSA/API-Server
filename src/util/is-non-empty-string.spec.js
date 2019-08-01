import { expect } from 'chai';

import { isNonEmptyString, isNonEmptyStrings } from './is-non-empty-string';

describe('isNonEmptyString', () => {
  it('should be false for null', () => {
    expect(isNonEmptyString(null)).to.equal(false);
  });

  it('should be false for undefined', () => {
    // eslint-disable-next-line no-undefined
    expect(isNonEmptyString(undefined)).to.equal(false);
  });

  it('should be false for empty string', () => {
    expect(isNonEmptyString('')).to.equal(false);
  });

  it('should be true for non-empty string allowing whitespace', () => {
    expect(isNonEmptyString('a')).to.equal(true);
    expect(isNonEmptyString(' ')).to.equal(true);
  });
});

describe('isNonEmptyStrings', () => {
  it('should be false for null', () => {
    expect(isNonEmptyStrings(null)).to.equal(false);
  });

  it('should be false for undefined', () => {
    // eslint-disable-next-line no-undefined
    expect(isNonEmptyStrings(undefined)).to.equal(false);
  });

  it('should be false for empty array', () => {
    expect(isNonEmptyStrings([])).to.equal(false);
  });

  it('should be false for array containing empty string', () => {
    expect(isNonEmptyStrings(['a', '', 'b'])).to.equal(false);
  });

  it('should be true for array containing only non-empty strings', () => {
    expect(isNonEmptyStrings(['a', 'b', 'c', ' '])).to.equal(true);
  });
});
