const pool = require('../db.conn');
const sql = require('../services/sql.service')

module.exports = {
  // TO RESGISTER USERS
  async register(email, password, role, marital_status, country, organization, designation, qualification, register_date, register_id, admin_type, status, employee_id) {
    try {
      const connection = await pool.getConnection();

      // REGISTERING ROLE IS ADMIN
      if (role == 'Admin') {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        const [isAdminRegistered] = await connection.query(sql.CHECK_ADMIN_REGISTERED, [email, role, admin_type]);
        if (isUserRegistered.length > 0 && isAdminRegistered.length > 0) {
          return { message: 'Admin is already registered' };
        }
        const user_id = isUserRegistered.length === 0 ? (await createUserAndReturnId()) : isUserRegistered[0].id;
        await connection.query(sql.ADD_ADMIN, [user_id, employee_id, admin_type]);
        return isUserRegistered.length === 0 ? { message: 'Admin registered successfully' } : { message: 'Admin registered Again' };
        async function createUserAndReturnId() {
          const [result] = await connection.query(sql.REGISTER_USER, [email, password, role, marital_status, country, organization, designation, qualification, register_date]);
          return result.insertId;
        }
      }

      // REGISTERING ROLE IS STUDENT
      if (role == 'Student') {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        const [isStudentRegistered] = await connection.query(sql.CHECK_STUDENT_REGISTERED, [email, role, register_id]);
        if (isUserRegistered.length > 0 && isStudentRegistered.length > 0) {
          return { message: 'Student is already registered' };
        }
        const user_id = isUserRegistered.length === 0 ? (await createUserAndReturnId()) : isUserRegistered[0].id;
        await connection.query(sql.ADD_STUDENT, [user_id, register_id, status ? status : 'active']);
        return isUserRegistered.length === 0 ? { message: 'Student registered successfully' } : { message: 'Student registered Again' };
        async function createUserAndReturnId() {
          const [result] = await connection.query(sql.REGISTER_USER, [email, password, role, marital_status, country, organization, designation, qualification, register_date]);
          return result.insertId;
        }
      }

      // REGISTERING ROLE IS INSTRUSTOR
      if (role == 'Instructor') {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        if (isUserRegistered.length > 0) {
          return { message: 'Instructor is already registered' };
        }
        const [result] = await connection.query(sql.REGISTER_USER, [email, password, role, marital_status, country, organization, designation, qualification, register_date]);
        const user_id = result.insertId;
        await connection.query(sql.ADD_INSTRUCTOR, [user_id]);
        return { message: 'Instructor registered successfully' };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },


  // SIGN IN
  async signIn(email, password, role) {
    try {
      const connection = await pool.getConnection();
      if (role === 'Instructor') {
        const [result] = await connection.query(sql.SIGN_IN_INSTRUCTOR, [email, password, role]);
        const user = result[0];
        return user;
      } else if (role === 'Student') {
        const [result] = await connection.query(sql.SIGN_IN_STUDENT, [email, password, role]);
        const user = result[0];
        return user;
      } else if (role === 'Admin') {
        const [result] = await connection.query(sql.SIGN_IN_ADMIN, [email, password, role]);
        const user = result[0];
        return user;
      } else {
        // Handle other roles or conditions here
        // For example, return { role: 'Other', user: user }
      }

    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
}



