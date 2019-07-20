import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import mysql from 'mysql';

import config from './config/config';

import createLogger from './log/logger';

import debugLogger from './debug/debugLogger';

import { createDbConnection, setConnection } from './db/db-connection';

const app = express();

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cross-origin resource sharing
app.use(cors());

// Rate-limiting
const rateLimiter = rateLimit({
    windowMs: config.get('rateLimit.windowMs'),
    max: config.get('rateLimit.windowMax'),
});

app.use(rateLimiter);

// Debug logging
if (config.get('env') !== 'production') {
    app.use(debugLogger);
}

// Request logging
const logger = createLogger({
    fileName: config.get('logging.fileName'),
    basePath: `${process.cwd()}/${config.get('logging.basePath')}`,
    interval: config.get('logging.interval'),
    fileSize: config.get('logging.fileSize'),
    compressionMethod: config.get('logging.compressionMethod'),
});

app.use(logger);

// Database integration
const databaseOptions = {
    host: config.get('database.host'),
    userName: config.get('database.userName'),
    userPassword: config.get('database.userPassword'),
    databaseName: config.get('database.databaseName'),
};

const connection = createDbConnection(mysql)(databaseOptions);
// Global database connection (singleton) created on at startup only.
setConnection(connection);

// The port the server is to listen on. Defaults to 3000.
const port = config.get('port');

const httpServer = app.listen(port, () => {
    const mode = config.get('name');
    const startupMessage = `Server listening on port ${port} in ${mode} mode`;
    console.log(startupMessage);
});

module.exports = app;
module.exports.port = httpServer.address().port;
