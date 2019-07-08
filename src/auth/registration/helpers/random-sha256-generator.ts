import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

@Injectable()
export class RandomSha256Generator {
    generate32RandomBytes(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const randomBytes = buffer.toString('hex');
                    resolve(randomBytes);
                }
            });
        });
    }

    hashUclcssaSessionKey(
        randomBytes: string,
        payload: string,
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                const hmac = crypto.createHmac('sha256', randomBytes);
                hmac.update(payload);
                // Hex (base 16) encoding is used to encode the generated
                // 256-bit uclcssaSessionKey. As each hex digit can
                // represent 4 bits, the resulting hex-encoded
                // uclcssaSessionKey is 64 hex digits long.
                const uclcssaSessionKey = hmac.digest('hex');
                resolve(uclcssaSessionKey);
            } catch (err) {
                reject(err);
            }
        });
    }
}
