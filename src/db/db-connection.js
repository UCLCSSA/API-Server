import isNonEmptyString from '../util/is-non-empty-string';

const dbOptionsAreValid = ({ host, userName, userPassword, databaseName }) =>
    isNonEmptyString(host)
    && isNonEmptyString(userName)
    && isNonEmptyString(userPassword)
    && isNonEmptyString(databaseName);

const createDbConnection = dbFactory => dbOptions => {
    if (!dbFactory || !dbFactory.createConnection) throw Error('Invalid connection factory.');
    if (!dbOptionsAreValid(dbOptions)) throw new Error('Invalid database options.');

    const { host, userName, userPassword, databaseName } = dbOptions;
    return dbFactory.createConnection({
        host,
        user: userName,
        password: userPassword,
        database: databaseName,
    });
};

let connection = null;

const getConnection = () => connection;

const setConnection = con => {
    // If a connection already exists do not try to update it.
    if (connection) return connection;
    // If a connection does not exist, use the given connection.
    connection = con;
    return connection;
};

export { getConnection, setConnection, createDbConnection };
