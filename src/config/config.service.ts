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
            NODE_ENV:
                Joi.string()
                   .valid(['development', 'production'])
                   .default('production'),
            PORT: Joi.number().default(3000),

            // Can be disabled for development
            API_AUTH_ENABLED: Joi.boolean().required(),

            // Required to obtain personal OAuth token from UCLAPI
            UCL_API_KEY: Joi.string().required(),

            // Rate limits
            RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
            RATE_LIMIT_MAX: Joi.number().default(100),

            // UCLCSSA session key expiration time (ms)
            // 30 d * 24 h * 60 min/h * 60 s/min * 1000 ms/s
            UCLCSSA_SESSION_KEY_EXPIRATION_MS:
                Joi.number().default(30 * 24 * 60 * 60 * 1000),
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

    get rateLimitWindowMs(): number {
        return parseInt(this.envConfig.RATE_LIMIT_WINDOW_MS, 10);
    }

    get rateLimitMax(): number {
        return parseInt(this.envConfig.RATE_LIMIT_MAX, 10);
    }
}
