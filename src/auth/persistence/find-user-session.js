import debug from '../../debug/debug';

import { getPool } from '../../persistence/db-connection';

const findUserSessionQuery = `
SELECT UclcssaSessionKey, CreationDatetime, WechatOpenId
    FROM UserSessions
    WHERE
        UclcssaSessionKey = ?
`;

const findUserSession = userSession =>
  new Promise((resolve, reject) => {
    const pool = getPool();

    const handler = (error, results, _fields) => {
      if (error) {
        debug(error);
        reject(error);
      }

      const [matchingUserSession] = results;

      if (!matchingUserSession) {
        debug('No matching user session found.');
        reject(new Error('No matching user session found.'));
      }

      resolve({
        uclcssaSessionKey: matchingUserSession.UclcssaSessionKey,
        creationDatetime: matchingUserSession.CreationDateTime,
        openId: matchingUserSession.WechatOpenId
      });
    };

    pool.query(findUserSessionQuery, [userSession], handler);
  });
