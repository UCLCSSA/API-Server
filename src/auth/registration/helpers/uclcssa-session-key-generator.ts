import { Injectable } from '@nestjs/common';

import { RandomSha256Generator } from './random-sha256-generator';

@Injectable()
export class UclcssaSessionKeyGenerator {
    constructor(
        private readonly randomSha256Generator: RandomSha256Generator,
    ) {}

    async generateUclcssaSessionKey(
        openId: string,
        sessionKey: string,
    ): Promise<string> {
        const payload = openId + sessionKey;

        // A 256-bit cryptographically-secure random number is generated
        // and is used as the SHA-256 key which is used to hash the payload
        // in order to generate a uclcssaSessionKey. This random number is
        // necessary to guarantee uniqueness of uclcssaSessionKey with
        // respect to time. This means that a uclcssaSessionKey may be
        // assigned a validity period and that when the client registers
        // again, a different uclcssaSessionKey is generated as a
        // result, invalidating the old uclcssaSessionKey.
        const randomBytes =
            await this.randomSha256Generator.generate32RandomBytes();
        return await this.randomSha256Generator.hashUclcssaSessionKey(
            randomBytes,
            payload,
        );
    }
}
