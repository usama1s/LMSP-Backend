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

  GET_ALL_STUDENTS: `
  SELECT *
  FROM student
  INNER JOIN users ON student.user_id = users.id
`,

  GET_STUDENT_WITH_PROGRAMS_DETAILS: `
  SELECT *
  FROM student_enrollment
  INNER JOIN program_plan ON student_enrollment.program_plan_id  = program_plan.program_plan_id 
  INNER JOIN course ON course.course_id = program_plan.course_id 
`,

  CHANGE_PASSWORD: `
  UPDATE users
  SET  password=? 
  WHERE id=?;
`,

  CHANGE_PROFILE_PICTURE: `
  UPDATE users
  SET profile_picture=?
  WHERE id=0;
`,
  CHANGE_PERSONAL_DETAILS: `
  UPDATE users
  SET  marital_status=?, country=?, organization=?, designation=?, qualification=?, first_name='', last_name=''
  WHERE id=0;
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
   (quiz_id, question, option_1, option_2, option_3, option_4, question_picture, answer)
   VALUES(?, ?, ?, ?, ?, ?, ?,?)
`,

  ADD_ASSIGNMENT: `
    INSERT INTO assignments
    (program_plan_id, assignment_date, assignment_file)
    VALUES(?, ?, ?)
  `,

  ADD_STUDENT_ATTENDENCE: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  MARK_ATTENDENCE: `
   INSERT INTO student_attendence
   (student_id, attendence_status, attendence_date)
   VALUES(?, ?, ?)
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

  ASSIGNMENT_SUBMISSION: `
   INSERT INTO assignment_submitted
   (student_id, assignment_id, submitted_file, marks, grade)
   VALUES(?, ?, ?, ?, ?)
  
`,
  ASSIGNMENT_NOT_SUBMISSION: `
INSERT INTO assignment_submitted
(student_id, assignment_id)
VALUES(?, ?)

`,

  QUIZ_SUBMISSION: `
INSERT INTO quiz_submitted
(student_id, quiz_id, total_marks, obtained_marks, grade)
VALUES(?, ?, ?, ?, ?);

`,

  QUIZ_NOT_SUBMITTED: `
INSERT INTO quiz_submitted
(student_id, quiz_id)
VALUES(?, ?);

`,

  GET_ATTENDENCE: `
  SELECT * FROM student_attendence WHERE student_id=?;
`,

  GET_ATTENDENCE_FOR_CHART: `
  SELECT COUNT(student_attendence.attendence_status) AS total_attendance_count,
       student_attendence.*,
       student_enrollment.*,
       program_plan.*
FROM student_attendence
LEFT JOIN student_enrollment ON student_enrollment.student_id = student_attendence.student_id
LEFT JOIN program_plan ON program_plan.program_plan_id = student_enrollment.program_plan_id
WHERE program_plan.course_id = ?
  AND student_attendence.student_id = ?
  AND student_attendence.attendence_status = ?
  AND program_plan.program_id = ?;
;
  
`,

  GET_COURSE_DETAILS_WITH_COURSE_ID: `
SELECT
    course.course_name,
    users.first_name,
    users.last_name,
    program_plan.program_id
FROM
    users
INNER JOIN instructor ON instructor.user_id = users.id
LEFT JOIN program_plan ON instructor.instructor_id = program_plan.instructor_id
LEFT JOIN course ON course.course_id = program_plan.course_id
WHERE
    course.course_id = ?
;

`,

  GET_QUIZ: `
  SELECT
    quiz.quiz_date,
    quiz_question.question,
    quiz_question.option_1,
    quiz_question.option_2,
    quiz_question.option_3,
    quiz_question.option_4,
    quiz_question.question_picture,
    quiz_question.answer
FROM
    student_enrollment
INNER JOIN program_plan ON student_enrollment.program_plan_id = program_plan.program_plan_id
INNER JOIN quiz ON quiz.program_plan_id = program_plan.program_plan_id
INNER JOIN quiz_question ON quiz_question.quiz_question_id = quiz.quiz_id
WHERE
    student_enrollment.student_id = ?
`,

GET_ASSIGNMENT: `
SELECT
  quiz.quiz_date,
  quiz_question.question,
  quiz_question.option_1,
  quiz_question.option_2,
  quiz_question.option_3,
  quiz_question.option_4,
  quiz_question.question_picture,
  quiz_question.answer
FROM
  student_enrollment
INNER JOIN program_plan ON student_enrollment.program_plan_id = program_plan.program_plan_id
INNER JOIN quiz ON quiz.program_plan_id = program_plan.program_plan_id
INNER JOIN quiz_question ON quiz_question.quiz_question_id = quiz.quiz_id
WHERE
  student_enrollment.student_id = ?
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
    (program_name, start_date, end_date)
    VALUES (?, ?, ?)
  `,

  ADD_PROGRAM_PLAN: `
    INSERT INTO program_plan
    (course_id, program_id, instructor_id)
    VALUES (?, ?, ?)
  `,

  GET_PROGRAM_PLAN: `
    SELECT *
    FROM program
    inner join program_plan  on program_plan.program_id  = program.program_id 
    inner join course on program_plan.course_id = course.course_id 
  `,

  ADD_CLASS: `
    INSERT INTO time_table
    (program_plan_id, class_date, class_time, class_link)
    VALUES(?, ?, ?, ?);
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

  GET_ALL_COURSES: `
  SELECT *
  FROM course
  INNER JOIN module  ON module.course_id  = course.course_id 
  INNER JOIN topic ON topic.module_id = module.module_id 
  `,

  GET_ALL_INSTRUCTORS: `
  SELECT *
  FROM users
  INNER JOIN instructor ON instructor.user_id = users.id 
  `,

  ENROLL_STUDENT: `
  INSERT INTO student_enrollment
  (program_plan_id, student_id, enrollment_date, program_status)
  VALUES(?, ?, ?, ?)
  `,

  GET_ALL_ADMINS: `
    SELECT *
    FROM users
    inner join admin on admin.user_id = users.id 
    where admin.admin_type > 1
  `,
};
