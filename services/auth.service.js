const pool = require('../db.conn');
const sql = require('../services/sql.service')
const { generateToken } = require('../util/admin.jwt')

module.exports = {

  
  // TO RESGISTER USERS
  async register(userDetail,profileFilePath) {
    try {
     const {email, password, role, marital_status, country, organization, designation, qualification, register_date, register_id, admin_types, status, employee_id, first_name, last_name}=userDetail
      // REGISTERING ROLE 1 IS ADMIN
      if (role == 1) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [email, role]);
        let isAdminRegistered;
    
        for (const admin_type of admin_types) {
            [isAdminRegistered] = await pool.query(sql.CHECK_ADMIN_REGISTERED, [email, role, admin_type]);
            if (isAdminRegistered.length > 0) {
                return { message: 'Admin is already registered' };
            }
        }
  
        if (isUserRegistered.length > 0) {
            return { message: 'User is already registered' };
        }
    
        const [result] = await pool.query(sql.REGISTER_USER, [profileFilePath, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
        const userId = result.insertId;
        for (const admin_type of admin_types) {
        await pool.query(sql.ADD_ADMIN, [userId, employee_id, admin_type]);
        }
        
        return { message: 'Admin registered successfully' };
    }
    

      // REGISTERING ROLE 2 IS INSTRUSTOR
      else if (role == 2) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [email, role]);
        if (isUserRegistered.length > 0) {
          return { message: 'Instructor is already registered' };
        }
        const [result] = await pool.query(sql.REGISTER_USER, [profileFilePath, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
        const user_id = result.insertId;
        await pool.query(sql.ADD_INSTRUCTOR, [user_id]);
        return { message: 'Instructor registered successfully' };
      }

      // REGISTERING ROLE 3 IS STUDENT
      else if (role == 3) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [email, role]);
        const [isStudentRegistered] = await pool.query(sql.CHECK_STUDENT_REGISTERED, [email, role]);
        if (isUserRegistered.length > 0 && isStudentRegistered.length > 0) {
          return { message: 'Student is already registered' };
        }
        const user_id = isUserRegistered.length === 0 ? (await createUserAndReturnId()) : isUserRegistered[0].id;
        await pool.query(sql.ADD_STUDENT, [user_id, register_id, status ? status : 'active']);
        return isUserRegistered.length === 0 ? { message: 'Student registered successfully' } : { message: 'Student registered Again' };
        async function createUserAndReturnId() {
          const [result] = await pool.query(sql.REGISTER_USER, [profileFilePath, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name]);
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
      if (role === 1) {
        const [result] = await pool.query(sql.SIGN_IN_ADMIN, [email, password, role]);
        const token = generateToken(result[0].id, result[0].role, result[0].admin_type);
        const user = [result, token];
        return user;
      } else if (role === 2) {
        const [result] = await pool.query(sql.SIGN_IN_INSTRUCTOR, [email, password, role]);
        const user = [result[0]];
        return user;
      } else if (role === 3) {
        const [result] = await pool.query(sql.SIGN_IN_STUDENT, [email, password, role]);
        const user = [result[0]];
        return user;
      }

    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },


}