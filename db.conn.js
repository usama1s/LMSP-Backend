// const mysql = require('mysql');

// async function connectToDatabase() {
//   const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'lms',
//   });

//   return new Promise((resolve, reject) => {
//     connection.connect((err) => {
//       if (err) {
//         console.error('Error connecting to the database:', err);
//         reject(err);
//       } else {
//         console.log('Query Done');
//         resolve(connection); // Resolve with the connection object
//       }
//     });
//   });
// }

// module.exports = connectToDatabase;
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lms',
});

module.exports = pool;