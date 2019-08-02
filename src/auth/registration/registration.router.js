import express from 'express';
import axios from 'axios';

import createWechatRegistrationHandler from './wechat-registration.handler';

import auth from './helpers/authenticate-via-wechat';
import generator from './helpers/generate-uclcssa-session-key';
import save from './helpers/save-user-session';

const registrationRouter = express.Router();

const wechatRegistrationHandler =
  createWechatRegistrationHandler(auth(axios))(generator)(save);

registrationRouter.post('/register/wechat', wechatRegistrationHandler);

export default registrationRouter;
