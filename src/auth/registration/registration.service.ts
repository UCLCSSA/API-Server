import { Injectable } from '@nestjs/common';

import { RegisterWithWeChatRequestDto } from './dto/register-with-wechat-request.dto';
import { UserSessionService } from './helpers/user-session.service';
import { WeChatAuthService } from './helpers/wechat-auth.service';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly weChatAuthService: WeChatAuthService,
        private readonly userSessionService: UserSessionService,
    ) {}

    async registerWithWeChat(
        registerWithWeChatDto: RegisterWithWeChatRequestDto,
    ): Promise<string> {
        const weChatAuthResponse =
            await this.weChatAuthService
                      .getWeChatAuthResponse(registerWithWeChatDto);

        return await this.userSessionService.saveSession(weChatAuthResponse);
    }
}
