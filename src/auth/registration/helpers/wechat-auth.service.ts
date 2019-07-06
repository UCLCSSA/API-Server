import {
    Body,
    GatewayTimeoutException,
    HttpException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import axios from 'axios';

import { RawWeChatAuthResponse } from '../interfaces/raw-wechat-auth-response.interface';
import { RegisterWithWeChatRequestDto } from '../dto/register-with-wechat-request.dto';
import { WeChatAuthResponse } from '../interfaces/wechat-auth-response.interface';
import { WeChatAuthResponseErrorCode } from '../error-codes/wechat-auth-response-error-code';

@Injectable()
export class WeChatAuthService {
    async getWeChatAuthResponse(
        @Body() registerWithWeChatDto: RegisterWithWeChatRequestDto,
    ) {
        const weChatApiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
        const requestParams = {
            params: {
                appid: registerWithWeChatDto.appId,
                secret: registerWithWeChatDto.appSecret,
                js_code: registerWithWeChatDto.code,
                grant_type: 'authorization_code',
            },
        };

        try {
            const rawResponse: RawWeChatAuthResponse =
                await axios.get(weChatApiUrl, requestParams);

            const response: WeChatAuthResponse =
                this.formatRawResponse(rawResponse);

            return this.handleWeChatAuthResponse(response);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new GatewayTimeoutException('Could not reach WeChat API.');
            }
        }
    }

    private formatRawResponse(
        rawResponse: RawWeChatAuthResponse,
    ): WeChatAuthResponse {
        return {
            openId: rawResponse.openid,
            sessionKey: rawResponse.session_key,
            unionId: rawResponse.unionid,
            errorCode: rawResponse.errcode,
            errorMessage: rawResponse.errmsg,
        };
    }

    private handleWeChatAuthResponse(
        response: WeChatAuthResponse,
    ): WeChatAuthResponse {
        switch (response.errorCode) {
            case WeChatAuthResponseErrorCode.Success:
                return response;
            case WeChatAuthResponseErrorCode.InvalidCode:
                throw new UnauthorizedException('WeChat code is invalid.');
            case WeChatAuthResponseErrorCode.RateLimitReached:
            case WeChatAuthResponseErrorCode.SystemBusy:
                throw new GatewayTimeoutException('WeChat API is unavailable.');
        }
    }
}
