import { expect } from 'chai';
import sinon from 'sinon';

import { createDbConnection } from './db-connection';

describe('createDbConnection', () => {
    it('should create database connection with user supplied options', () => {
        const dbOptions = {
            host: 'host',
            userName: 'user',
            userPassword: 'secret',
            databaseName: 'hello_world_db',
        };

        const fakeDbFactory = { createConnection: sinon.fake() };

        createDbConnection(fakeDbFactory)(dbOptions);

        expect(fakeDbFactory.createConnection.calledOnce).to.equal(true);

        const result = fakeDbFactory.createConnection.args[0][0];
        expect(result.host).to.equal(dbOptions.host);
        expect(result.user).to.equal(dbOptions.userName);
        expect(result.password).to.equal(dbOptions.userPassword);
        expect(result.database).to.equal(dbOptions.databaseName);
    });

    it('should throw error if invalid database options are given', () => {
        const invalidDbOptions = {
            // empty options are not allowed.
            host: '',
            userName: null,
            userPassword: 'secret',
            databaseName: 'hello_world_db',
        };

        const fakeDbFactory = { createConnection: sinon.fake() };

        expect(() => {
            createDbConnection(fakeDbFactory)(invalidDbOptions);
        }).to.throw();
    });
});
