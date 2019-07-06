// See
// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html.
export interface RawWeChatAuthResponse {
    readonly openid: string;
    // tslint:disable-next-line:variable-name
    readonly session_key: string;
    readonly unionid: string;
    readonly errcode: number;
    readonly errmsg: string;
}
