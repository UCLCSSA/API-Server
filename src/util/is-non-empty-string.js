const isNonEmptyString = x => typeof x === 'string' && x.length > 0;

const isNonEmptyStrings = xs =>
    Array.isArray(xs)
    && xs.length > 0
    && xs.reduce((isAllNonEmpty, x) => isAllNonEmpty && isNonEmptyString(x));

export { isNonEmptyString, isNonEmptyStrings };
