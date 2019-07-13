import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';

import { UserSession } from './registration/entities/user-session.entity';
import { RandomSha256Generator } from './registration/helpers/random-sha256-generator';
import { UclcssaSessionKeyGenerator } from './registration/helpers/uclcssa-session-key-generator';
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';
import { UserSessionService } from './registration/helpers/user-session.service';
import { WeChatAuthService } from './registration/helpers/wechat-auth.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserSession])],
    controllers: [RegistrationController],
    providers: [
        RegistrationService,
        WeChatAuthService,
        UserSessionService,
        UclcssaSessionKeyGenerator,
        RandomSha256Generator,
    ],
})
export class AuthenticationModule {}
