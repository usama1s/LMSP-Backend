const pool = require('../db.conn');
const sql = require('../services/sql.service')


// TO RESGISTER USERS
async function register(email, password, role, marital_status, country, organization, designation, qualification, register_date) {
  try {
    connection = await pool.getConnection();
    const [isRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, email);
    // const registeredEmail = isRegistered[0][0].email ? isRegistered[0][0].email : null
    if ([isRegistered.length] == 0) {
      const results = await connection.query(sql.REGISTER_USER, [email, password, role, marital_status, country, organization, designation, qualification, register_date]);

      if (results.affectedRows === 1) {
        return { message: 'User registered successfully', };
      } else {
        return { message: 'User registration failed' };
      }
    } else {
      return { message: 'User is already registered' };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


// SIGN IN
async function signIn(email, password) {
  try {
    connection = await pool.getConnection();
    const results = await connection.query(sql.SIGN_IN_USER, [email, password]);
    return results[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = {
  signIn,
  register
}



