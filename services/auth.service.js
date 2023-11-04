const util = require('util');
const connectToDatabase = require('../db.con');



async function signIn(userData) {
  try {
    const connection = await connectToDatabase();

    const insertQuery = `
      INSERT INTO users
      (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userData.profile_picture || '',
      userData.email || '',
      userData.password || '',
      userData.role || '',
      userData.marital_status || '',
      userData.country || '',
      userData.organization || '',
      userData.designation || '',
      userData.qualification || '',
      userData.register_date || '',
    ];

    const results = await connection.query(insertQuery, values);
    return results.values;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Re-throw the error for handling elsewhere
  }
}

// Export the createUser function
module.exports = {
  signIn
};
