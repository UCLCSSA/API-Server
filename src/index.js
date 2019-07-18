const debug = require('debug')('server:debug');

import config from 'config';
import express from 'express';

const app = express();

// The port the server is to listen on. Defaults to 3000.
const port = config.has('port') ? config.get('port') : 3000;

const httpServer = app.listen(port, () => {
    const mode = config.get('name');
    const startupMessage = `Server listening on port ${port} in ${mode} mode`;
    debug(startupMessage);
    console.log(startupMessage);
});

module.exports = app;
module.exports.port = httpServer.address().port;
