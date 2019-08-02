import currentDatetime from '../../../util/current-datetime-mysql';

import findUserSession from './find-user-session';
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
      const existingUserSession = await findUserSession(wechatOpenId);

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
