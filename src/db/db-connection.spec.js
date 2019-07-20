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

        const fakeDbFactory = { createConnection: sinon.fake() };

        createDbConnection(fakeDbFactory)(dbOptions);

        expect(fakeDbFactory.createConnection.calledOnce).to.equal(true);
        expect(fakeDbFactory.createConnection.args[0][0]).to.deep.equal(dbOptions);
    });

    it('should throw error if invalid database options are given', () => {
        const invalidDbOptions = {
            // empty options are not allowed.
            host: '',
            user: null,
            password: 'secret',
            database: 'hello_world_db',
        };

        const fakeDbFactory = { createConnection: sinon.fake() };

        expect(() => {
            createDbConnection(fakeDbFactory)(invalidDbOptions);
        }).to.throw();
    });
});
