import currentDatetime from '../../../util/current-datetime-mysql';

import findUserSessionByOpenId from './find-user-session-by-open-id';
import updateUserSession from './update-user-session';
import insertUserSession from './insert-user-session';

const saveUserSession =
  async ({
    uclcssaSessionKey,
    wechatOpenId,
    wechatSessionKey,
    uclapiToken
  }) => {
    try {
      const existingUserSession = await findUserSessionByOpenId(wechatOpenId);

      const creationDatetime = currentDatetime();

      const data = {
        uclcssaSessionKey,
        wechatOpenId,
        wechatSessionKey,
        uclapiToken,
        creationDatetime
      };

      if (existingUserSession) {
        await updateUserSession(data);
      } else {
        await insertUserSession(data);
      }

      return true;
    } catch (error) {
      return false;
    }
  };

export default saveUserSession;
