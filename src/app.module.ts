import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from './auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(), AuthenticationModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
