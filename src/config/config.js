import convict from 'convict';

/*
 * Config schema.
 * See https://github.com/mozilla/node-convict for usage.
 */
const config = convict({
    env: {
        doc: 'Application environment.',
        format: [ 'production', 'development', 'test' ],
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
        doc: 'Rate limiting settings.',
        windowMs: {
            doc: 'Time until request count is reset (milliseconds).',
            format: 'int',
            default: 5 * 60 * 1000,
            env: 'RATE_LIMIT_WINDOW_MS',
        },
        windowMax: {
            doc: 'Max requests per window period.',
            format: 'int',
            default: 100,
            env: 'RATE_LIMIT_WINDOW_MAX',
        },
    },
    logging: {
        doc: 'Log file settings.',
        fileName: {
            doc: 'Name of log file.',
            format: String,
            default: 'access.log',
            env: 'LOG_FILE_NAME',
        },
        basePath: {
            doc: 'Base path of log file.',
            format: String,
            default: `log`,
            env: 'LOG_BASE_PATH',
        },
        interval: {
            doc: 'How long before log file is rotated.',
            format: String,
            default: '1d',
            env: 'LOG_INTERVAL',
        },
        fileSize: {
            doc: 'How large before log file is rotated.',
            format: String,
            default: '10M',
            env: 'LOG_FILE_SIZE',
        },
        compressionMethod: {
            doc: 'How is the log file compressed.',
            format: [ 'gzip' ],
            default: 'gzip',
            env: 'LOG_COMPRESSION',
        },
    },
    database: {
        doc: 'Database connection settings.',
        host: {
            doc: 'Database host.',
            format: String,
            default: 'localhost',
            env: 'DB_HOST',
        },
        userName: {
            doc: 'Database user name.',
            format: String,
            default: 'api_user',
            env: 'DB_USERNAME',
        },
        userPassword: {
            doc: 'Database user password.',
            format: '*',
            default: '',
            sensitive: true,
            env: 'DB_PASSWORD',
        },
        databaseName: {
            doc: 'Name of database.',
            format: String,
            default: 'db',
            env: 'DB_DATABASE_NAME',
        },
    },
});

// Load environment-specific config file
const currentEnv = config.get('env');
// Config folder at: $PROJECT_ROOT/config
const configDir = `${process.cwd()}/config`;
const configFilePath = `${configDir}/${currentEnv}.json`;
config.loadFile(configFilePath);

// Validate config
config.validate({ allowed: 'strict' });

export default config;
