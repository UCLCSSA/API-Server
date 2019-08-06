import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const findUserSessionByOpenId = wechatOpenId =>
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
        debug('ERROR!');
        debug(error);
        reject(error);
      }

      resolve(() => {
        // Try to find one matching record.
        const [matchingUserSession] = results;

        if (!matchingUserSession) {
          debug('No matching user session found.');
          return null;
        }

        const {
          UclcssaSessionKey,
          WechatOpenId,
          WechatSessionKey,
          UclapiToken,
          CreationDatetime
        } = matchingUserSession;

        return {
          uclcssaSessionKey: UclcssaSessionKey,
          creationDatetime: CreationDatetime,
          wechatOpenId: WechatOpenId,
          wechatSessionKey: WechatSessionKey,
          uclapiToken: UclapiToken
        };
      });
    };

    pool.query(findUserSessionQuery, [wechatOpenId], handler);
  });

export default findUserSessionByOpenId;
