// sql-queries.js

// Define your SQL queries as named constants
module.exports = {


  // SHARED   
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




  // CHECK ADMIN ALREADY EXISTS
  CHECK_USER_REGISTERED: `
  SELECT *
  FROM users where email=? AND role=?
`,






  // INSTRUCTOR


  // FOR REGISTERING A TEACHER


  ADD_INSTRUCTOR: `
  INSERT INTO instructor
  (user_id)
  VALUES (?)
`,

  // TO SIGN IN INSTRUCTOR
  SIGN_IN_INSTRUCTOR: `
    SELECT * FROM users
    where email=? AND password=?
`,

  // CHECK USER ALREADY EXISTS
  CHECK_INSTRUCTOR_REGISTERED: `
    SELECT users.id , users.email
    FROM users
    inner join admin on admin.user_id =users.id 
    where  users.email=? and users.role =?
  `,

  // CHECK USER ALREADY EXISTS
  SIGN_IN_INSTRUCTOR: `
    SELECT *
    FROM users
    inner join instructor on instructor.user_id = users.id 
    where users.email=? and users.password=? and users.role =?
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





  // STUDENT


  // FOR REGISTERING A STUDENT
  ADD_STUDENT: `
  INSERT INTO student
  (user_id,register_id, status)
  VALUES (?, ?, ?)
`,
  // CHECK USER ALREADY EXISTS
  CHECK_STUDENT_REGISTERED: `
  SELECT users.id , users.email, student.register_id
  FROM users
  inner join student on student.user_id =users.id 
  where  users.email=? and users.role =? AND student.register_id =?
  `,

  SIGN_IN_STUDENT: `
  SELECT *
  FROM users
  inner join student on student.user_id = users.id 
  where users.email=? and users.password=? and users.role =?
`,





  // ADMIN


  // CHECK USER ALREADY EXISTS
  CHECK_ADMIN_REGISTERED: `
    SELECT users.id , users.email, admin.admin_type
    FROM users
    inner join admin on admin.user_id =users.id 
    where  users.email=? and users.role =? AND admin.admin_type =?
   `,

  // FOR REGISTERING AN ADMIN
  ADD_ADMIN: `
    INSERT INTO admin
    (user_id, employment_id, admin_type)
    VALUES (?, ?, ?)
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

  // CHECK ADMIN ALREADY EXISTS
  // 1 =super WILL REGISTER ADMIN,
  // 2= instrutor,
  // 3=inventory,
  // 4=student,
  // 5= program

  SIGN_IN_ADMIN: `
    SELECT *
    FROM users
    inner join admin on admin.user_id = users.id 
    where users.email=? and users.password=? and users.role =?
  `,


  // TO ADD COURSES TO BE STUDIED
  ADD_INVENTORY_ITEM: `
  INSERT INTO inventory 
  (admin_id, title, description, expiry, induction, make, model, information_file, video_file, failure_reason) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 `,

  // ADD FILE 
  ADD_IMAGES_OF_ITEM: `
  INSERT INTO inventory_image 
  (inventory_id, image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 `,

  // GET ALL ITEMS
  GET_ALL_ITEMS: `
 SELECT *
 FROM inventory
 inner join inventory_image on inventory.inventory_id  = inventory_image.inventory_id 
 `,
  // GET ALL ITEMS BY ID
  GET_ITEM_BY_ID: `
 SELECT *
 FROM inventory
 inner join inventory_image on inventory.inventory_id  = inventory_image.inventory_id 
 where inventory.i
 
 
 
 
 
 
 nventory_id=?
 `,

};
