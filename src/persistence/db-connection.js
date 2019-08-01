import mysql from 'mysql';

let pool = null;

const createPool = ({
  connectionLimit,
  host,
  userName,
  password,
  databaseName
}) => mysql.createPool({
  connectionLimit,
  host,
  user: userName,
  password,
  database: databaseName
});

const setPool = poolInstance => {
  pool = poolInstance;
  return pool;
};

const getPool = () => pool;

export { createPool, getPool, setPool };
