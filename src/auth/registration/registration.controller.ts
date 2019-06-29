import { Body, Controller, Post } from '@nestjs/common';

import { RegisterWithWeChatRequestDto } from './dto/register-with-wechat-request.dto';
import { RegistrationService } from './registration.service';

@Controller('register')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post('wechat')
    async registerWithWeChat(
        @Body() registerWithWeChatDto: RegisterWithWeChatRequestDto,
    ) {
        return await this.registrationService
                         .registerWithWeChat(registerWithWeChatDto);
    }
}
