import express from 'express';

import wechatRegistrationHandler from './wechat-registration.handler';

const registrationRouter = express.Router();

registrationRouter.post('/register/wechat', wechatRegistrationHandler);

export default registrationRouter;
