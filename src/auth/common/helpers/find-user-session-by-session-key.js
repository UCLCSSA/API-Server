import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

import { isNonEmptyString } from '../../../util/is-non-empty-string';

const findUserSessionBySessionKey = uclcssaSessionKey => {
  // Ensure uclcssaSessionKey is NOT empty string as the default value for
  // uclcssaSessionKey is empty string in the database.
  if (!isNonEmptyString(uclcssaSessionKey)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const pool = getPool();

    const findUserSessionQuery = `
      SELECT 
        UclcssaSessionKey, 
        WechatOpenId, 
        WechatSessionKey, 
        UclapiToken, 
        CreationDatetime,
        LastUsed
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
          return null;
        }

        const {
          UclcssaSessionKey,
          WechatOpenId,
          WechatSessionKey,
          UclapiToken,
          CreationDatetime,
          LastUsed
        } = matchingUserSession;

        return {
          uclcssaSessionKey: UclcssaSessionKey,
          creationDatetime: CreationDatetime,
          wechatOpenId: WechatOpenId,
          wechatSessionKey: WechatSessionKey,
          uclapiToken: UclapiToken,
          lastUsed: LastUsed
        };
      });
    };

    pool.query(findUserSessionQuery, [uclcssaSessionKey], handler);
  });
};

export default findUserSessionBySessionKey;
