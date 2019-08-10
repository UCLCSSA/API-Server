const isSessionExpired =
  expirationTimeS =>
    (lastUsed, current) => {
      return current.diff(lastUsed, 'seconds') > expirationTimeS;
    };

export default isSessionExpired;
