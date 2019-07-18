import convict from 'convict';

/*
 * Config schema.
 * See https://github.com/mozilla/node-convict for usage.
 */
const config = convict({
    env: {
        doc: 'Application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },
    name: {
        doc: 'Environment description.',
        format: String,
        default: 'development',
    },
    port: {
        doc: 'Port the server is to run on.',
        format: 'port',
        default: 3000,
        env: 'PORT',
    },
    rateLimit: {
        doc: 'Rate limiting',
        windowMs: {
            doc: 'Time until request count is reset (milliseconds).',
            format: 'int',
            default: 5 * 60 * 1000,
            env: 'RATE-LIMIT-WINDOW-MS',
        },
        windowMax: {
            doc: 'Max requests per window period.',
            format: 'int',
            default: 100,
            env: 'RATE-LIMIT-WINDOW-MAX',
        },
    },
});

// Load environment-specific config file
const currentEnv = config.get('env');
const configDir = `${process.cwd()}/config`;
const configFilePath = `${configDir}/${currentEnv}.json`;
config.loadFile(configFilePath);

// Validate config
config.validate({ allowed: 'strict' });

module.exports = config;
