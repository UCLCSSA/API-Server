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
        CreationDatetime = ?
      WHERE
        WechatOpenId = ?;
    `;

    const handler = (error, result) => {
      if (error) {
        debug(error);
        reject(error);
      }

      debug(`User session updated: ${result.affectedRows} affected rows`);
    };

    pool.query(updateUserSessionQuery, [
      uclcssaSessionKey,
      wechatSessionKey,
      uclapiToken,
      creationDatetime,
      wechatOpenId
    ], handler);
  });

export default updateUserSession;
