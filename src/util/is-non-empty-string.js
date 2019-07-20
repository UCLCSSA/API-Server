const isNonEmptyString = x =>
    typeof x === 'string'
    && x.length > 0;

export default isNonEmptyString;
