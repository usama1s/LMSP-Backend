const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "developer",
  database: "lms",
});

module.exports = pool;
