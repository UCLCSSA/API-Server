import ContentType from '../../util/http-content-type';
import debug from '../../debug/debug';

// Depends on registration tier checking middleware.
const createLogoutHandler =
    clearUserSession => {
      if (!clearUserSession) {
        throw Error('Missing clearUserSession dependency.');
      }

      return async (request, response, next) => {
        try {
          const { uclcssaSessionKey } = request.locals.userSession;

          if (!uclcssaSessionKey) {
            debug('createLogoutHandler needs registrationTierValidator' +
              ' mounted before.');
            throw new Error('Missing registrationTierValidator middleware.');
          }

          // We clear associated wechat sessionKey and uclapi token with the
          // given uclcssaSessionKey. This invalidates the user session.
          await clearUserSession(uclcssaSessionKey);

          // We simply send 200 OK if logging out is successful.
          response.status(200);
          response.type(ContentType.JSON);
          response.end();
          next();
        } catch (error) {
          next(error);
        }
      };
    };

export default createLogoutHandler;
