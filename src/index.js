const debug = require('debug')('server:debug');

import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import config from '../config/config';

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

// The port the server is to listen on. Defaults to 3000.
const port = config.get('port');

const httpServer = app.listen(port, () => {
    const mode = config.get('name');
    const startupMessage = `Server listening on port ${port} in ${mode} mode`;
    debug(startupMessage);
    console.log(startupMessage);
});

module.exports = app;
module.exports.port = httpServer.address().port;
