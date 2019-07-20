import { expect } from 'chai';
import sinon from 'sinon';

import createDbConnection from './db-connection';

describe('createDbConnection', () => {
    it('should create database connection with user supplied options', () => {
        const dbOptions = {
            host: 'host',
            user: 'user',
            password: 'secret',
            database: 'hello_world_db',
        };

        const mockMysqlFactory = { createConnection: sinon.fake() };

        createDbConnection(mockMysqlFactory)(dbOptions);

        expect(mockMysqlFactory.createConnection.calledOnce).to.equal(true);
        expect(mockMysqlFactory.createConnection.args[0][0])
            .to.deep.equal(dbOptions);
    });
});
