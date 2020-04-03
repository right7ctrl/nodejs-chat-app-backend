const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '192.168.64.2',
    user: 'right7ctrl',
    password: 'local_pass',
    database: 'chat_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
module.exports = pool;