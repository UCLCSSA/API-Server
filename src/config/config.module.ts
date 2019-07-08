import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';

@Module({
    providers: [
        {
            provide: ConfigService,
            // Use different `*.env` configuration file depending on
            // development or production environment:
            // Either use `development.env` or `production.env`.
            useValue: new ConfigService(`${process.env.NODE_ENV}.env`),
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule {}
