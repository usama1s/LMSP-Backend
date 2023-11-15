module.exports = {
  // GENERAL

  GET_ALL_USERS: `
    SELECT *
    FROM users
    LEFT JOIN admin ON admin.user_id = users.id
    LEFT JOIN student ON student.user_id = users.id
    LEFT JOIN instructor ON instructor.user_id = users.id;
  `,

  REGISTER_USER: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date, first_name, last_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,

  CHECK_USER_REGISTERED: `
    SELECT *
    FROM users
    WHERE email=? AND role=?
  `,

  // INSTRUCTOR____________________________________________________________________________________________________________

  ADD_INSTRUCTOR: `
    INSERT INTO instructor
    (user_id)
    VALUES (?)
  `,

  SIGN_IN_INSTRUCTOR: `
    SELECT *
    FROM users
    WHERE email=? AND password=?
  `,

  CHECK_INSTRUCTOR_REGISTERED: `
    SELECT users.id, users.email
    FROM users
    INNER JOIN admin ON admin.user_id = users.id
    WHERE users.email=? AND users.role = ?
  `,

  SIGN_IN_INSTRUCTOR: `
    SELECT *
    FROM users
    INNER JOIN instructor ON instructor.user_id = users.id
    WHERE users.email=? AND users.password=? AND users.role = ?
  `,

  ADD_QUIZ: `
    INSERT INTO quiz
    (program_plan_id, quiz_date)
    VALUES(?, ?);
  
  `,

  ADD_QUIZ_QUESTION: `
  INSERT INTO lms.quiz_question
  (quiz_id, question, option_1, option_2, option_3, option_4, question_picture)
  VALUES(?, ?, ?, ?, ?, ?, ?)

`,

  ADD_ASSIGNMENT: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  ADD_STUDENT_ATTENDENCE: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // STUDENT____________________________________________________________________________________________________________

  ADD_STUDENT: `
    INSERT INTO student
    (user_id, register_id, status)
    VALUES (?, ?, ?)
  `,

  CHECK_STUDENT_REGISTERED: `
    SELECT users.id, users.email, student.register_id
    FROM users
    INNER JOIN student ON student.user_id = users.id
    WHERE users.email=? AND users.role = ?
  `,

  SIGN_IN_STUDENT: `
    SELECT *
    FROM users
    INNER JOIN student ON student.user_id = users.id
    WHERE users.email=? AND users.password=? AND users.role = ?
  `,

  // ADMIN____________________________________________________________________________________________________________

  CHECK_ADMIN_REGISTERED: `
    SELECT users.id, users.email, admin.admin_type
    FROM users
    INNER JOIN admin ON admin.user_id = users.id
    WHERE users.email=? AND users.role = ? AND admin.admin_type = ?
  `,

  ADD_ADMIN: `
    INSERT INTO admin
    (user_id, employment_id, admin_type)
    VALUES (?, ?, ?)
  `,

  ADD_COURSE: `
    INSERT INTO course
    (course_name, course_description)
    VALUES (?, ?)
  `,

  ADD_MODULE: `
    INSERT INTO module
    (course_id, module_name)
    VALUES (?, ?)
  `,

  ADD_TOPIC: `
    INSERT INTO topic
    (module_id, topic_name, lecture_file)
    VALUES (?, ?, ?)
  `,

  ADD_PROGRAM: `
    INSERT INTO program
    (program_name)
    VALUES (?)
  `,

  ADD_PROGRAM_PLAN: `
    INSERT INTO program_plan
    (course_id, program_id, instructor_id, program_name, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  ADD_TIME_TABLE: `
    INSERT INTO time_table
    (program_plan_id, class_date, class_time)
    VALUES (?, ?, ?)
  `,

  ADD_STUDENT_COURSE: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  SIGN_IN_ADMIN: `
    SELECT *
    FROM users
    INNER JOIN admin ON admin.user_id = users.id
    WHERE users.email=? AND users.password=? AND users.role = ?
  `,

  ADD_INVENTORY_ITEM: `
    INSERT INTO inventory 
    (admin_id, title, description, expiry, induction, make, model, information_file, video_file, failure_reason) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  ADD_IMAGES_OF_ITEM: `
    INSERT INTO inventory_image 
    (inventory_id, image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  GET_ALL_ITEMS: `
    SELECT *
    FROM inventory
    INNER JOIN inventory_image ON inventory.inventory_id = inventory_image.inventory_id
  `,

  GET_ITEM_BY_ID: `
    SELECT *
    FROM inventory
    INNER JOIN inventory_image ON inventory.inventory_id = inventory_image.inventory_id
    WHERE inventory.inventory_id=?
  `,
};
