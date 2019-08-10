const ErrorType = {
  BAD_REQUEST: {
    MISSING_REQUIRED_KEYS: '@bad-request/missing-required-keys',
    MISSING_AUTHORIZATION_HEADER: '@bad-request/missing-authorization-header',
    INVALID_API_VERSION: '@bad-request/invalid-api-version',
    INVALID_EMAIL: '@bad-request/invalid-email'
  },
  FORBIDDEN: {
    FAILED_WECHAT_AUTHENTICATION: '@forbidden/failed-wechat-authentication',
    INVALID_UCLCSSA_SESSION_KEY: '@forbidden/invalid-uclcssa-session-key',
    EXPIRED_UCLCSSA_SESSION_KEY: '@forbidden/expired-uclcssa-session-key'
  },
  INTERNAL_SERVER_ERROR: {
    FAILED_UCLCSSA_SESSION_KEY_GENERATION:
      '@internal-server-error/failed-uclcssa-session-key-generation',
    FAILED_SAVE_USER_SESSION:
      '@internal-server-error/failed-to-save-user-session'
  }
};

export default ErrorType;
