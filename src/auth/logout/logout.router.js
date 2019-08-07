import express from 'express';

import createLogoutHandler from './logout.handler';

import findUserSessionBySessionKey
  from './helpers/find-user-session-by-session-key';
import clearUserSession from './helpers/clear-user-session';

const logoutRouter = express.Router();

const logoutHandler =
  createLogoutHandler(findUserSessionBySessionKey)(clearUserSession);

logoutRouter.post('/logout', logoutHandler);

export default logoutRouter;
