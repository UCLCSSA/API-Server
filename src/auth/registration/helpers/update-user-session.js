import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const updateUserSession =
  ({
    uclcssaSessionKey,
    wechatOpenId,
    wechatSessionKey,
    uclapiToken,
    creationDatetime
  }) => new Promise((resolve, reject) => {
    const pool = getPool();

    const updateUserSessionQuery = `
      UPDATE UserSessions
      SET
        UclcssaSessionKey = ?,
        WechatSessionKey = ?,
        UclapiToken = ?,
        CreationDatetime = ?,
        LastUsed = ?
      WHERE
        WechatOpenId = ?;
    `;

    const handler = (error, result) => {
      if (error) {
        debug(error);
        reject(error);
      }

      debug(`User session updated: ${result.affectedRows} affected rows`);
      resolve();
    };

    pool.query(updateUserSessionQuery, [
      uclcssaSessionKey,
      wechatSessionKey,
      uclapiToken,
      creationDatetime,
      // lastUsed is same as creationDatetime since session is generated
      creationDatetime,
      wechatOpenId
    ], handler);
  });

export default updateUserSession;
