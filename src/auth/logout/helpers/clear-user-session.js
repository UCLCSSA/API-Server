import debug from '../../../debug/debug';

import { getPool } from '../../../persistence/db-connection';

const clearUserSession = uclcssaSessionKey =>
  new Promise((resolve, reject) => {
    const pool = getPool();

    const clearUserSessionQuery = `
      UPDATE UserSessions
      SET
        WechatSessionKey = '',
        UclapiToken = '',
        UclcssaSessionKey = ''
      WHERE
        UclcssaSessionKey = ?;
    `;

    const handler = (error, result) => {
      if (error) {
        debug(error);
        reject(error);
      }

      debug(`User session updated: ${result.affectedRows} affected rows`);
      resolve();
    };

    pool.query(clearUserSessionQuery, [uclcssaSessionKey], handler);
  });

export default clearUserSession;
