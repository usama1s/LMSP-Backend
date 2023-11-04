const mysql = require('mysql');

async function connectToDatabase() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lms',
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        reject(err);
      } else {
        console.log('Connected to the database');
        resolve(connection); // Resolve with the connection object
      }
    });
  });
}

module.exports = connectToDatabase;
