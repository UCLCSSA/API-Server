import fs from 'fs';

import debug from '../debug/debug';

/*
 * This function is not async since we load all query files to strings at
 * startup (so we don't have JavaScript AND SQL in the same file).
 */
const readQueryString = path => {
    try {
        const queryString = fs.readFileSync(path, { encoding: 'utf8' });
        return queryString;
    } catch (error) {
        debug(error);
        throw new Error(`Specified query file at ${path} not found.`);
    }
};

export default readQueryString;
