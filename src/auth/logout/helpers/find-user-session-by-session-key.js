import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const findUserSessionBySessionKey = uclcssaSessionKey =>
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
          UclcssaSessionKey = ?;
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
          return false;
        }

        return true;
      });
    };

    pool.query(findUserSessionQuery, [uclcssaSessionKey], handler);
  });

export default findUserSessionBySessionKey;
