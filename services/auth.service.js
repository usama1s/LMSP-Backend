const pool = require("../db.conn");
const sql = require("../services/sql.service");
const { generateToken } = require("../util/admin.jwt");

module.exports = {
  // TO RESGISTER USERS
  async register(userDetail, profileFilePath) {
    try {
      const {
        email,
        password,
        role,
        marital_status,
        country,
        organization,
        designation,
        qualification,
        register_date,
        register_id,
        admin_types,
        status,
        employee_id,
        first_name,
        last_name,
      } = userDetail;
      // REGISTERING ROLE 1 IS ADMIN
      if (role == 1) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [
          email,
          role,
        ]);
        let isAdminRegistered;

        for (const admin_type of admin_types) {
          [isAdminRegistered] = await pool.query(sql.CHECK_ADMIN_REGISTERED, [
            email,
            role,
            admin_type,
          ]);
          if (isAdminRegistered.length > 0) {
            return { message: "Admin is already registered" };
          }
        }

        if (isUserRegistered.length > 0) {
          return { message: "User is already registered" };
        }

        const [result] = await pool.query(sql.REGISTER_USER, [
          profileFilePath,
          email,
          password,
          role,
          marital_status,
          country,
          organization,
          designation,
          qualification,
          register_date,
          first_name,
          last_name,
        ]);
        const userId = result.insertId;
        for (const admin_type of admin_types) {
          await pool.query(sql.ADD_ADMIN, [userId, employee_id, admin_type]);
        }

        return { message: "Admin registered successfully" };
      }

      // REGISTERING ROLE 2 IS INSTRUSTOR
      else if (role == 2) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [
          email,
          role,
        ]);
        if (isUserRegistered.length > 0) {
          return { message: "Instructor is already registered" };
        }
        const [result] = await pool.query(sql.REGISTER_USER, [
          profileFilePath,
          email,
          password,
          role,
          marital_status,
          country,
          organization,
          designation,
          qualification,
          register_date,
          first_name,
          last_name,
        ]);
        const user_id = result.insertId;
        await pool.query(sql.ADD_INSTRUCTOR, [user_id]);
        return { message: "Instructor registered successfully" };
      }

      // REGISTERING ROLE 3 IS STUDENT
      else if (role == 3) {
        const [isUserRegistered] = await pool.query(sql.CHECK_USER_REGISTERED, [
          email,
          role,
        ]);
        const [isStudentRegistered] = await pool.query(
          sql.CHECK_STUDENT_REGISTERED,
          [email, role]
        );
        if (isUserRegistered.length > 0 && isStudentRegistered.length > 0) {
          return { message: "Student is already registered" };
        }
        const user_id =
          isUserRegistered.length === 0
            ? await createUserAndReturnId()
            : isUserRegistered[0].id;
        await pool.query(sql.ADD_STUDENT, [
          user_id,
          register_id,
          status ? status : "active",
        ]);
        return isUserRegistered.length === 0
          ? { message: "Student registered successfully" }
          : { message: "Student registered Again" };
        async function createUserAndReturnId() {
          const [result] = await pool.query(sql.REGISTER_USER, [
            profileFilePath,
            email,
            password,
            role,
            marital_status,
            country,
            organization,
            designation,
            qualification,
            register_date,
            first_name,
            last_name,
          ]);
          return result.insertId;
        }
      } else {
        return { message: "No user registered" };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // SIGN IN
  async signIn(email, password, role) {
    try {
      if (role === 1) {
        const [results] = await pool.query(sql.SIGN_IN_ADMIN, [
          email,
          password,
          role,
        ]);

        if (results.length > 0) {
          const tokens = results.map((result) =>
            generateToken(result.id, result.role, result.admin_type)
          );

          const users = results.map((result, index) => ({
            ...result,
            token: tokens[index],
          }));

          const transformedUser = {
            first_name: users[0].first_name,
            last_name: users[0].last_name,
            email: users[0].email,
            password: users[0].password,
            role: users[0].role,
            marital_status: users[0].marital_status,
            country: users[0].country,
            organization: users[0].organization,
            designation: users[0].designation,
            qualification: users[0].qualification,
            register_date: users[0].register_date,
            admin_types: users.map((user) => user.admin_type),
            register_id: users[0].register_id,
            employee_id: users[0].employment_id,
            profile_image_type: users[0].profile_image_type,
            profile_image: users[0].profile_image,
          };
          return transformedUser;
        } else {
          return { message: "Admin does not exist" };
        }
      } else if (role === 2) {
        const [result] = await pool.query(sql.SIGN_IN_INSTRUCTOR, [
          email,
          password,
          role,
        ]);
        if (result.length > 0) {
          const [user] = [result];
          const transformedUser = {
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
            password: user[0].password,
            role: user[0].role,
            marital_status: user[0].marital_status,
            country: user[0].country,
            organization: user[0].organization,
            designation: user[0].designation,
            qualification: user[0].qualification,
            register_date: user[0].register_date,
            register_id: user[0].register_id,
            employee_id: user[0].employment_id,
            profile_image_type: user[0].profile_image_type,
            profile_image: user[0].profile_image,
          };
          return transformedUser;
        } else {
          return { message: "Instructor does not exist" };
        }
      } else if (role === 3) {
        const [result] = await pool.query(sql.SIGN_IN_STUDENT, [
          email,
          password,
          role,
        ]);
        if (result.length > 0) {
          const [user] = [result];
          const transformedUser = {
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
            password: user[0].password,
            role: user[0].role,
            marital_status: user[0].marital_status,
            country: user[0].country,
            organization: user[0].organization,
            designation: user[0].designation,
            qualification: user[0].qualification,
            register_date: user[0].register_date,
            register_id: user[0].register_id,
            employee_id: user[0].employment_id,
            profile_image_type: user[0].profile_image_type,
            profile_image: user[0].profile_image,
            student_id: user[0].student_id,
          };
          return transformedUser;
        } else {
          return { message: "Student does not exist" };
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },
};
