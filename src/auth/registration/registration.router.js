import express from 'express';

import createWechatRegistrationHandler from './wechat-registration.handler';

import authenticateViaWechat
  from 'src/auth/registration/helpers/authenticate-via-wechat';

const registrationRouter = express.Router();

const wechatRegistrationHandler =
  createWechatRegistrationHandler(authenticateViaWechat)(null);

registrationRouter.post('/register/wechat', wechatRegistrationHandler);

export default registrationRouter;
