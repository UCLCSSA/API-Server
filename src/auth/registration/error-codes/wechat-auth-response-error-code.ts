// Refer to https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
// for error code related to WeChat's `auth.code2Session`.
export enum WeChatAuthResponseErrorCode {
  SystemBusy = 1,
  Success = 0,
  InvalidCode = 40029,
  RateLimitReached = 45011,
}
