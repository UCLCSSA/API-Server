import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const findUserSession = wechatOpenId =>
  new Promise((resolve, reject) => {
    const pool = getPool();

    const findUserSessionQuery = `
      SELECT 
        UclcssaSessionKey, 
        WechatOpenId, 
        WechatSessionKey, 
        UclapiToken, 
        CreationDatetime
      FROM UserSessions
      WHERE
        WechatOpenId = ?;
    `;

    const handler = (error, results) => {
      if (error) {
        debug(error);
        reject(error);
      }

      // Try to find one matching record.
      const [matchingUserSession] = results;

      if (!matchingUserSession) {
        debug('No matching user session found.');
        resolve(null);
      }

      const {
        UclcssaSessionKey,
        WechatOpenId,
        WechatSessionKey,
        UclapiToken,
        CreationDatetime
      } = matchingUserSession;

      resolve({
        uclcssaSessionKey: UclcssaSessionKey,
        creationDatetime: CreationDatetime,
        wechatOpenId: WechatOpenId,
        wechatSessionKey: WechatSessionKey,
        uclapiToken: UclapiToken
      });
    };

    pool.query(findUserSessionQuery, [wechatOpenId], handler);
  });

export default findUserSession;
