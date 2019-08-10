const ErrorType = {
  BAD_REQUEST: {
    INVALID_API_VERSION: '@bad-request/invalid-api-version',
    INVALID_EMAIL: '@bad-request/invalid-email',
    MISSING_REQUIRED_KEYS: '@bad-request/missing-required-keys'
  },
  FORBIDDEN: {
    MISSING_AUTHORIZATION_HEADER: '@forbidden/missing-authorization-header',
  },
  UNAUTHORIZED: {
    EXPIRED_UCLCSSA_SESSION_KEY: '@unauthorized/expired-uclcssa-session-key',
    FAILED_WECHAT_AUTHENTICATION: '@unauthorized/failed-wechat-authentication',
    INVALID_UCLCSSA_SESSION_KEY: '@unauthorized/invalid-uclcssa-session-key'
  },
  INTERNAL_SERVER_ERROR: {
    FAILED_UCLCSSA_SESSION_KEY_GENERATION:
      '@internal-server-error/failed-uclcssa-session-key-generation',
    FAILED_SAVE_USER_SESSION:
      '@internal-server-error/failed-to-save-user-session'
  }
};

export default ErrorType;
