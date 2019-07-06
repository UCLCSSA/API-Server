import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const bootstrap = async () => {
    // HTTPS Options must be loaded before the app is created, meaning that
    // the ConfigService provider cannot be used here. Instead, the paths are
    // hard-coded and assumed to exist.
    // The private key and public certificate are assumed to exist below.
    // Change the paths as required.
    const sslKeyPath = './ssl/private-key.key';
    const sslCertificatePath = './ssl/public-certificate.crt';
    const httpsOptions = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertificatePath),
    };

    const app = await NestFactory.create(AppModule, { httpsOptions });

    app.enableCors();
    app.use(helmet());
    app.use(csurf());

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const configService = app.get(ConfigService);
    app.use(rateLimit({
        windowMs: configService.rateLimitWindowMs,
        max: configService.rateLimitMax,
    }));

    await app.listen(3000);
};

// noinspection JSIgnoredPromiseFromCall
bootstrap();
