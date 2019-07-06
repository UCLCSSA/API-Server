import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.use(helmet());
    app.use(csurf());

    const configService = app.get(ConfigService);
    app.use(rateLimit({
        windowMs: configService.rateLimitWindowMs,
        max: configService.rateLimitMax,
    }));

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(3000);
};

// noinspection JSIgnoredPromiseFromCall
bootstrap();
