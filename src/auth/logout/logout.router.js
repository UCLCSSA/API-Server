import express from 'express';

import config from '../../config/config';

import createLogoutHandler from './logout.handler';

import findUserSessionBySessionKey
  from './helpers/find-user-session-by-session-key';
import clearUserSession from './helpers/clear-user-session';

const logoutRouter = express.Router();

const expirationTimeS = config.get('uclcssaSessionKeyExpirationTimeS');

const logoutHandler =
  createLogoutHandler(findUserSessionBySessionKey)(clearUserSession)(expirationTimeS);

logoutRouter.post('/logout', logoutHandler);

export default logoutRouter;
