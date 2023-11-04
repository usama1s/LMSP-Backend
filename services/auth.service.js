const connectToDatabase = require('../db.conn');
const sql = require('../services/sql.service')

// SIGN IN
async function signIn(userData) {
  try {
    const connection = await connectToDatabase();
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
    const results = await connection.query(sql.REGISTER_USER, values);
    return results.values;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


// EXPORTS
module.exports = {
  signIn
};
