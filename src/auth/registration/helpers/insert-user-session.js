import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const insertUserSession =
  ({
    uclcssaSessionKey,
    wechatOpenId,
    wechatSessionKey,
    uclapiToken,
    creationDatetime
  }) => new Promise((resolve, reject) => {
    const pool = getPool();

    const insertUserSessionQuery = `
      INSERT INTO UserSessions( UclcssaSessionKey,
                                CreationDatetime,
                                WechatOpenId,
                                WechatSessionKey,
                                UclapiToken,
                                LastUsed )
      VALUES
          ( ?, ?, ?, ?, ?, ? );
    `;

    const handler = (error, result) => {
      if (error) {
        debug(error);
        reject(error);
      }

      debug(`New user session inserted: ${result.affectedRows} affected rows`);
      resolve();
    };

    pool.query(insertUserSessionQuery, [
      uclcssaSessionKey,
      creationDatetime,
      wechatOpenId,
      wechatSessionKey,
      uclapiToken,
      // lastUsed same as creationDatetime since session is generated
      creationDatetime
    ], handler);
  });

export default insertUserSession;
