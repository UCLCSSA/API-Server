export interface WeChatAuthResponse {
    readonly openId: string;
    readonly sessionKey: string;
    readonly unionId: string;
    readonly errorCode: number;
    readonly errorMessage: string;
}
