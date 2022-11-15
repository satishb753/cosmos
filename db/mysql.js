const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodedb",
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodedb",
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
