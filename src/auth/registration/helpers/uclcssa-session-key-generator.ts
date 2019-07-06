import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

@Injectable()
export class UclcssaSessionKeyGenerator {
    generateUclcssaSessionKey(
        openId: string, sessionKey: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            // The core data is composed of openId concatenated with sessionKey.
            // These data are obtained from WeChat API. We cannot return
            // WeChat's sessionKey directly due to client-side security issues.
            // Instead, we need to generate a new uclcssaSessionKey to act as a
            // proxy - there is a one-to-one correspondence between
            // uclcssaSessionKey <-> sessionKey. Requests made to WeChat APIs
            // require the client to return uclcssaSessionKey, then the backend
            // service will query records, and if a matching record is found,
            // the backend service will use the corresponding WeChat sessionKey
            // to retrieve WeChat API information on behalf of the user.
            const payload = openId + sessionKey;

            // A 256-bit cryptographically-secure random number is generated
            // and is used as the SHA-256 key which is used to hash the payload
            // in order to generate a uclcssaSessionKey. This random number is
            // necessary to guarantee uniqueness of uclcssaSessionKey with
            // respect to time. This means that a uclcssaSessionKey may be
            // assigned a validity period and that when the client registers
            // again, a different uclcssaSessionKey is generated as a
            // result, invalidating the old uclcssaSessionKey.
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const random = buffer.toString('hex');
                    const hmac = crypto.createHmac('sha256', random);
                    hmac.update(payload);
                    // Hex (base 16) encoding is used to encode the generated
                    // 256-bit uclcssaSessionKey, meaning that the
                    // uclcssaSessionKey is 16 hex digits long.
                    const uclcssaSessionKey = hmac.digest('hex');
                    resolve(uclcssaSessionKey);
                }
            });
        });
    }
}
