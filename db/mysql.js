const mysql = require("mysql2");

require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// connection.execute(
//   "SELECT * FROM users WHERE `name` = ?",
//   ["satish"],
//   function (err, results, fields) {
//     console.log(results);
//     console.log(fields);
//   }
// );

module.exports = { connection, pool };
