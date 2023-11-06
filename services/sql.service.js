// sql-queries.js

// Define your SQL queries as named constants
module.exports = {
  // ADD ADMIN, STUDENT, INSTRUCTOR
  GET_ALL_USER: `
  SELECT * FROM users
  `,

  // ADD ADMIN, STUDENT, INSTRUCTOR
  REGISTER_USER: `
  INSERT INTO users
  (email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,

  // CHECK USER ALREADY EXISTS
  CHECK_USER_REGISTERED: `
  SELECT *
  FROM users where email=?
`,

  // TO SIGN IN STUDENT
  SIGN_IN_USER: `
  SELECT * FROM users
  where email=? AND password=?
`,

  // FOR REGISTERING A STUDENT
  ADD_STUDENT: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // FOR REGISTERING A TEACHER
  ADD_INSTRUCTOR: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // FOR REGISTERING AN ADMIN
  ADD_ADMIN: `
  INSERT INTO admin
  (user_id)
  VALUES (?)
`,

  // TO ADD COURSES TO BE STUDIED
  ADD_COURSE: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // TO RECORD THAT WHICH STUDENT IS REGISTERED IN WHICH COURSE
  ADD_STUDENT_COURSE: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // ADD A QUIZ FOR STUDENT
  ADD_QUIZ: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // ADD AN ASSIGNMENT FOR THE STUDENTS
  ADD_ASSIGNMENT: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,

  // STUDENT ATTENDENCE FOR THERE PRESENCE
  ADD_STUDENT_ATTENDENCE: `
  INSERT INTO users
  (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,



};
