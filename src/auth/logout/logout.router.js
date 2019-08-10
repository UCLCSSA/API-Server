import express from 'express';

import requireRegistrationTier
  from '../common/require-registration-tier.validator';

import createLogoutHandler from './logout.handler';

import clearUserSession from './helpers/clear-user-session';

import RegistrationTier from '../common/registration-tier';

const logoutRouter = express.Router();

const logoutHandler = createLogoutHandler(clearUserSession);

logoutRouter.post('/logout',
  requireRegistrationTier(RegistrationTier.WECHAT_REGISTERED),
  logoutHandler
);

export default logoutRouter;
