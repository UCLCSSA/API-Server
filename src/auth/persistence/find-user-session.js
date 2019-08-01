import debug from '../../debug/debug';

import { getPool } from '../../persistence/db-connection';

const findUserSession = userSession =>
  new Promise((resolve, reject) => {
    const pool = getPool();

    const findUserSessionQuery = `
      SELECT UclcssaSessionKey, CreationDatetime, WechatOpenId
        FROM UserSessions
        WHERE
          UclcssaSessionKey = ?
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
        reject(new Error('No matching user session found.'));
      }

      const {
        UclcssaSessionKey,
        WechatOpenId,
        CreationDateTime
      } = matchingUserSession;

      resolve({
        uclcssaSessionKey: UclcssaSessionKey,
        creationDateTime: CreationDateTime,
        openId: WechatOpenId
      });
    };

    pool.query(findUserSessionQuery, [userSession], handler);
  });

export default findUserSession;
