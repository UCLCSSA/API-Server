import express from 'express';

import createWechatRegistrationHandler from './wechat-registration.handler';

import authenticateViaWechat from './helpers/authenticate-via-wechat';
import generateUclcssaSessionKey from './helpers/generate-uclcssa-session-key';

const registrationRouter = express.Router();

const wechatRegistrationHandler =
  createWechatRegistrationHandler(
    authenticateViaWechat
  )(generateUclcssaSessionKey);

registrationRouter.post('/register/wechat', wechatRegistrationHandler);

export default registrationRouter;
