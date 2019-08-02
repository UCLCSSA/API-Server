import crypto from 'crypto';
import util from 'util';

const randomBytes = util.promisify(crypto.randomBytes);

const generateUclcssaSessionKey =
  async ({ wechatOpenId, wechatSessionKey }) => {
    if (!wechatOpenId || !wechatSessionKey) return null;

    try {
      // We generate 256 bits (32 bytes) to be used as the key for SHA-256 HMAC
      // to generate uclcssaSessionKey. This random number is used to guarantee
      // that two uclcssaSessionKey generated from the same wechatOpenId and
      // wechatSessionKey is distinct if they are not generated exactly at the
      // same time with the same entropy. Such distinctness is used so that
      // we can associate each uclcssaSessionKey with an expiration datetime -
      // each uclcssaSessionKey is intended to represent a valid user session.
      // Since uclcssaSessionKey is unique with regard to time and entropy, we
      // can invalidate compromised and expired uclcssaSessionKey and regenerate
      // and reissue them to the client.
      const key = await randomBytes(32);

      // We shall create a new HMAC instance each time we are to generate a
      // uclcssaSessionKey since the key is different each time.
      const hmac = crypto.createHmac('sha256', key);

      hmac.update(wechatOpenId, 'utf8');
      hmac.update(wechatSessionKey, 'utf8');

      // We encode the 256 bits of SHA-256 raw bits with hexadecimal encoding.
      // This yields exactly 64 characters, hence the uclcssaSessionKey is
      // exactly 64 characters in length.
      return hmac.digest('hex');
    } catch (error) {
      // Any failures are system-level and we can't do much about it. We
      // delegate handling such internal errors to the caller.
      return null;
    }
  };

export default generateUclcssaSessionKey;
