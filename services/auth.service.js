const pool = require('../db.conn');
const sql = require('../services/sql.service')
const { generateToken } = require('../util/admin.jwt')

module.exports = {

  
  // TO RESGISTER USERS
  async register(email, password, role, marital_status, country, organization, designation, qualification, register_date, register_id, admin_type, status, employee_id, profile_image, first_name, last_name) {
    try {
      const connection = await pool.getConnection();

      // REGISTERING ROLE 1 IS ADMIN
      if (role == 1) {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        const [isAdminRegistered] = await connection.query(sql.CHECK_ADMIN_REGISTERED, [email, role, admin_type]);
        if (isUserRegistered.length > 0 && isAdminRegistered.length > 0) {
          return { message: 'Admin is already registered' };
        }
        const user_id = isUserRegistered.length === 0 ? (await createUserAndReturnId()) : isUserRegistered[0].id;
        await connection.query(sql.ADD_ADMIN, [user_id, employee_id, admin_type]);
        return isUserRegistered.length === 0 ? { message: 'Admin registered successfully' } : { message: 'Admin registered Again' };
        async function createUserAndReturnId() {
          const [result] = await connection.query(sql.REGISTER_USER, [profile_image, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
          return result.insertId;
        }
      }

      // REGISTERING ROLE 2 IS INSTRUSTOR
      else if (role == 2) {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        if (isUserRegistered.length > 0) {
          return { message: 'Instructor is already registered' };
        }
        const [result] = await connection.query(sql.REGISTER_USER, [profile_image, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
        const user_id = result.insertId;
        await connection.query(sql.ADD_INSTRUCTOR, [user_id]);
        return { message: 'Instructor registered successfully' };
      }

      // REGISTERING ROLE 3 IS STUDENT
      else if (role == 3) {
        const [isUserRegistered] = await connection.query(sql.CHECK_USER_REGISTERED, [email, role]);
        const [isStudentRegistered] = await connection.query(sql.CHECK_STUDENT_REGISTERED, [email, role]);
        if (isUserRegistered.length > 0 && isStudentRegistered.length > 0) {
          return { message: 'Student is already registered' };
        }
        const user_id = isUserRegistered.length === 0 ? (await createUserAndReturnId()) : isUserRegistered[0].id;
        await connection.query(sql.ADD_STUDENT, [user_id, register_id, status ? status : 'active']);
        return isUserRegistered.length === 0 ? { message: 'Student registered successfully' } : { message: 'Student registered Again' };
        async function createUserAndReturnId() {
          const [result] = await connection.query(sql.REGISTER_USER, [profile_image, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
          return result.insertId;
        }
      }
      else {
        return { message: 'No user registered' };

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
      if (role === 1) {
        const [result] = await connection.query(sql.SIGN_IN_ADMIN, [email, password, role]);
        const token = generateToken(result[0].id, result[0].role, result[0].admin_type);
        const user = [result, token];
        return user;
      } else if (role === 2) {
        const [result] = await connection.query(sql.SIGN_IN_INSTRUCTOR, [email, password, role]);
        const user = [result[0]];
        return user;
      } else if (role === 3) {
        const [result] = await connection.query(sql.SIGN_IN_STUDENT, [email, password, role]);
        const user = [result[0]];
        return user;
      }

    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },


}