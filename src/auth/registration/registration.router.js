import express from 'express';

import createWechatRegistrationHandler from './wechat-registration.handler';

const registrationRouter = express.Router();

const wechatRegistrationHandler = createWechatRegistrationHandler()();

registrationRouter.post('/register/wechat', wechatRegistrationHandler);

export default registrationRouter;
