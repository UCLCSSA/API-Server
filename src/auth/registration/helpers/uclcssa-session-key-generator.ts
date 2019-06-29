import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

/*
 * UCLCSSA Session keys are intended to be 128-bits.
 * Each key is generated from the information:
 *  - WeChat openId
 *  - WeChat sessionKey
 *  - A 32-byte secure random number as secret key
 */

@Injectable()
export class UclcssaSessionKeyGenerator {
    generateUclcssaSessionKey(
        openId: string, sessionKey: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const payload = openId + sessionKey;

            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const random = buffer.toString('hex');
                    const hmac = crypto.createHmac('sha256', random);
                    hmac.update(payload);
                    const uclcssaSessionKey = hmac.digest('hex');
                    resolve(uclcssaSessionKey);
                }
            });
        });
    }
}
