import isNonEmptyString from '../util/is-non-empty-string';

const dbOptionsAreValid = ({ host, user, password, database }) =>
    isNonEmptyString(host)
    && isNonEmptyString(user)
    && isNonEmptyString(password)
    && isNonEmptyString(database);

const createDbConnection = dbFactory => dbOptions => {
    if (!dbFactory || !dbFactory.createConnection) throw Error('Invalid connection factory.');
    if (!dbOptionsAreValid(dbOptions)) throw new Error('Invalid database options.');

    const { host, user, password, database } = dbOptions;
    return dbFactory.createConnection({ host, user, password, database });
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
