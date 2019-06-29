import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

// Rate limit parameters *would* ideally be loaded via the `config` module,
// but that module is loaded AFTER the rate limiting middleware is loaded.
// Hence, we must manually obtain the two config parameters from `process.env`.
const RATE_LIMIT_WINDOW_MS: number =
    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);

const RATE_LIMIT_MAX: number =
    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10);

if (isNaN(RATE_LIMIT_WINDOW_MS) || isNaN(RATE_LIMIT_MAX)) {
    throw new Error('Invalid rate limit settings!');
}

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);

    // CORS, CSRF policies
    app.enableCors();
    app.use(helmet());
    app.use(csurf());

    // Rate limiting
    app.use(rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_MAX,
    }));

    // Validation
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(3000);
};

// noinspection JSIgnoredPromiseFromCall
bootstrap();
