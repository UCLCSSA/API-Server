import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UclcssaSessionKeyGenerator } from './uclcssa-session-key-generator';
import { UserSession } from '../entities/user-session.entity';
import { WeChatAuthResponse } from '../interfaces/wechat-auth-response.interface';

@Injectable()
export class UserSessionService {
    constructor(
        @InjectRepository(UserSession)
        private readonly userSessionRepository: Repository<UserSession>,
        private readonly uclcssaSessionKeyGeneratorService:
            UclcssaSessionKeyGenerator,
    ) {}

    async saveSession(response: WeChatAuthResponse): Promise<string> {
        const userSession = new UserSession();
        userSession.openId = response.openId;
        userSession.uclapiToken = '';
        userSession.weChatSessionKey = response.sessionKey;
        userSession.uclcssaSessionKey =
            await this.uclcssaSessionKeyGeneratorService
                      .generateUclcssaSessionKey(response.openId,
                          response.sessionKey);
        // The creation datetime of the uclcssaSessionKey is recorded so
        // that requests with uclcssaSessionKey can be checked for expiration.
        userSession.uclcssaSessionKeyCreatedAt = new Date();

        const successfulSession: UserSession =
            await this.userSessionRepository.save(userSession);

        return successfulSession.uclcssaSessionKey;
    }
}
