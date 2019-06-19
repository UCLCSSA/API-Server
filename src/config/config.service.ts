import * as fs from 'fs';

import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export interface EnvConfig {
    [key: string]: string;
}

export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = ConfigService.validateInput(config);
    }

    private static validateInput(envConfig: EnvConfig): EnvConfig {
        const envSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                         .valid(['development', 'production'])
                         .default('production'),
            PORT: Joi.number()
                     .default(3000),
            // Can be disabled for development
            API_AUTH_ENABLED: Joi.boolean()
                                 .required(),
            // Required to obtain personal OAuth token from UCLAPI
            UCL_API_KEY: Joi.string()
                            .required(),
            // Required for SSL
            SSL_KEY_PATH: Joi.string()
                             .required(),
            SSL_CERT_PATH: Joi.string()
                              .required(),
            // Rate limits
            RATE_LIMIT_WINDOW_MS: Joi.number()
                                     .default(15 * 60 * 1000),
            RATE_LIMIT_MAX: Joi.number()
                               .default(100),
        });

        const { error, value: validatedEnvConfig } =
            Joi.validate(envConfig, envSchema);

        if (error) {
            throw new Error(`Invalid config: ${ error.message }`);
        } else {
            return validatedEnvConfig;
        }
    }

    get nodeEnv(): string {
        return this.envConfig.NODE_ENV;
    }

    get port(): number {
        return parseInt(this.envConfig.PORT, 10);
    }

    get isApiAuthEnabled(): boolean {
        return Boolean(this.envConfig.API_AUTH_ENABLED);
    }

    get uclApiKey(): string {
        return this.envConfig.UCL_API_KEY;
    }

    get sslKeyPath(): string {
        return this.envConfig.SSL_KEY_PATH;
    }

    get sslCertificatePath(): string {
        return this.envConfig.SSL_CERT_PATH;
    }

    get rateLimitWindowMs(): number {
        return parseInt(this.envConfig.RATE_LIMIT_WINDOW_MS, 10);
    }

    get rateLimitMax(): number {
        return parseInt(this.envConfig.RATE_LIMIT_MAX, 10);
    }
}
