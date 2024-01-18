module.exports = {
  // GENERAL

  GET_ALL_USERS: `
    SELECT *
    FROM users
    LEFT JOIN admin ON admin.user_id = users.id
    LEFT JOIN student ON student.user_id = users.id
    LEFT JOIN instructor ON instructor.user_id = users.id;
  `,

  GET_USER_BY_ID: `
  SELECT *
  FROM users
  LEFT JOIN admin ON admin.user_id = users.id
  LEFT JOIN student ON student.user_id = users.id
  LEFT JOIN instructor ON instructor.user_id = users.id
  WHERE users.id = ?;
`,

  EDIT_USER_BY_ID: `
  UPDATE users
  SET ?
  WHERE id = ?;
`,

  DELETE_USER_BY_ID: `
  DELETE FROM users
  WHERE id = ?;
`,

  UPDATE_ADMIN_TYPE: `
  UPDATE admin
  SET admin_type = ?
  WHERE user_id = ?;
`,
  EDIT_ADMIN_DETAILS: `
  UPDATE users
  SET ?, admin_type = ?
  WHERE id = ?;
`,
  EDIT_INSTRUCTOR_DETAILS: `
  UPDATE users
  SET ?
  WHERE id = ?;
`,
  EDIT_STUDENT_DETAILS: `
  UPDATE users
  SET ?
  WHERE id = ?;
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

  GET_ADMIN_DETAILS: `
  SELECT users.*, admin.*
  FROM users
  INNER JOIN admin ON admin.user_id = users.id
  WHERE users.id = ?;
`,
  GET_INSTRUCTOR_DETAILS: `
  SELECT users.*, instructor.*
  FROM users
  INNER JOIN instructor ON instructor.user_id = users.id
  WHERE users.id = ?;
`,
  GET_STUDENT_DETAILS: `
  SELECT users.*, student.*
  FROM users
  INNER JOIN student ON student.user_id = users.id
  WHERE users.id = ?;
`,
  SIGN_IN_INSTRUCTOR: `
    SELECT *
    FROM users
    INNER JOIN instructor ON instructor.user_id = users.id
    WHERE users.email=? AND users.password=? AND users.role = ?
  `,

  ADD_QUIZ: `
    INSERT INTO quiz
    (subject_id,instructor_id, quiz_date, section)
    VALUES(?, ?, ?, ?);
  `,

  ADD_PAPER: `
    INSERT INTO instructor_papers
    (subject_id,instructor_id, paper_date, section,title)
    VALUES(?, ?, ?, ?,?);
  `,

  ADD_INCHARGE_PAPER: `
    INSERT INTO incharge_papers
    (subject_id,admin_id, paper_date,title)
    VALUES(?, ?, ?,?);
  `,

  // SQL query for retrieving instructor papers by subject and filtering out past papers
  GET_INSTRUCTOR_PAPERS_BY_SUBJECT_AND_DATE: `
  SELECT
    ip.subject_id,
    ip.instructor_id,
    ip.section,
    ip.paper_date,
    iq.question,
    iq.options,
    iq.correctOption,
    iq.image
  FROM instructor_papers ip
  JOIN instructor_paper_questions iq ON ip.paper_id = iq.instructor_paper_id
  WHERE ip.subject_id = ? AND ip.paper_date >= CURDATE()
  ORDER BY ip.paper_date ASC;
`,

  // GET INCHARGE PAPERS BY PAPER ID
  GET_INCHARGE_PAPER_BY_PAPER_ID: `
  SELECT
    ip.subject_id,
    ip.instructor_id,
    ip.section,
    ip.paper_date,
    iq.question,
    iq.options,
    iq.correctOption,
    iq.image
  FROM incharge_papers ip
  JOIN incharge_paper_questions iq ON ip.paper_id = iq.incharge_paper_id
  WHERE ip.paper_id = ?
  ORDER BY ip.paper_date ASC;
`,

  // SQL query for deleting instructor paper
  DELETE_INSTRUCTOR_PAPER: `
  DELETE FROM instructor_papers
  WHERE paper_id = ?;
`,

  DELETE_INCHARGE_PAPER: `
  DELETE FROM incharge_papers
  WHERE id = ?;
`,

  DELETE_PAPER_QUESTIONS: `
  DELETE FROM instructor_paper_questions
  WHERE instructor_paper_id = ?;
`,

  DELETE_INCHARGE_PAPER_QUESTIONS: `
  DELETE FROM incharge_paper_questions
  WHERE incharge_paper_id = ?;
`,

  EDIT_PAPER: `
  UPDATE instructor_papers
  SET
    subject_id = ?,
    instructor_id = ?,
    paper_date = ?,
    section = ?,
    title = ?
  WHERE paper_id = ?;
`,

  EDIT_PAPER_QUESTION: `
  UPDATE instructor_paper_questions
  SET
    title = ?,
    question = ?,
    option_1 = ?,
    option_2 = ?,
    option_3 = ?,
    option_4 = ?,
    question_picture = ?,
    question_video = ?,
    answer = ?
  WHERE question_id = ?;
`,

  EDIT_QUIZ_BY_ID: `
  UPDATE quiz
  SET ?
  WHERE quiz_id = ?;
`,

  DELETE_QUIZ_BY_ID: `
  DELETE FROM quiz
  WHERE quiz_id = ?;
`,

  ADD_QUIZ_QUESTION: `
   INSERT INTO quiz_question
   (quiz_id, question, option_1, option_2, option_3, option_4, question_picture, answer)
   VALUES(?, ?, ?, ?, ?, ?, ?,?)
`,

  ADD_PAPER_QUESTION: `
   INSERT INTO instructor_paper_questions
   (instructor_paper_id	,title, question, option_1, option_2, option_3, option_4, question_picture, question_video,answer)
   VALUES(?, ?, ?, ?, ?, ?, ?,?,?,?)
`,

  ADD_INCHARGE_PAPER_QUESTION: `
   INSERT INTO incharge_paper_questions
   (incharge_paper_id	,question_id)
   VALUES(?, ?)
`,

  ADD_ASSIGNMENT: `
    INSERT INTO assignments
    ( assignment_date, assignment_file, assignment_instruction, assignment_title,subject_id,instructor_id)
    VALUES(?, ?, ?, ?, ?, ?)
  `,

  EDIT_ASSIGNMENT_BY_ID: `
  UPDATE assignments
  SET ?
  WHERE assignment_id = ?;
`,
  DELETE_ASSIGNMENT_BY_ID: `
  DELETE FROM assignments
  WHERE assignment_id = ?;
`,
  ADD_STUDENT_ATTENDENCE: `
    INSERT INTO users
    (profile_picture, email, password, role, marital_status, country, organization, designation, qualification, register_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  //   GET_STUDENTS_BY_SUBJECT_ID: `
  // SELECT
  //   u.*,
  //   sa.*,
  //   s.student_id
  // FROM
  //   users u
  // JOIN
  //   student s ON u.id = s.user_id
  // JOIN
  //   student_enrollment se ON s.student_id = se.student_id
  // JOIN
  //   courses c ON se.course_id = c.course_id
  // JOIN
  //   modules m ON c.course_id = m.course_id
  // JOIN
  //   subjects sub ON m.module_id = sub.module_id
  //  JOIN
  //   student_attendence sa ON s.student_id = sa.student_id AND sa.attendence_date =?
  // WHERE
  //   sa.subject_id = ?

  //   `,

  GET_STUDENTS_BY_SUBJECT_ID: `
SELECT
    u.first_name,
    u.last_name,
    u.email,
    s.*,
    COALESCE(sa.attendence_status, 0) AS attendence_status,
    sa.attendence_date
FROM
    users u
JOIN
    student s ON u.id = s.user_id
LEFT JOIN
    student_enrollment se ON s.student_id = se.student_id
LEFT JOIN
    courses c ON se.course_id = c.course_id
LEFT JOIN
    modules m ON c.course_id = m.course_id
LEFT JOIN
    subjects sub ON m.module_id = sub.module_id
LEFT JOIN
    student_attendence sa ON s.student_id = sa.student_id
                         AND sub.subject_id = sa.subject_id
                         AND sa.attendence_date = ?
WHERE
    sub.subject_id = ?



`,

  MARK_ATTENDENCE: `
   INSERT INTO student_attendence
   (student_id, attendence_status, attendence_date,subject_id)
   VALUES(?, ?, ?, ?)
`,

  CHECK_ATTENDENCE_EXISTENCE: `
  SELECT * FROM student_attendence
  WHERE student_id = ? AND attendence_date = ? AND subject_id = ?
`,

  UPDATE_ATTENDENCE: `
  UPDATE student_attendence
  SET attendence_status = ?
  WHERE attendence_date = ? AND subject_id = ? AND student_id = ?
`,

  GET_COURSES_BY_INSTRUCTOR: `
SELECT
    course.course_name,
    course.course_description
FROM
    module
// INNER JOIN instructor ON module.instructor_id = instructor.instructor_id
INNER JOIN course ON course.course_id = module.course_id
WHERE
    instructor.instructor_id = ?
`,

  //GET PAPERS BY SUBJECT ID
  GET_PAPER_BY_SUBJECT_ID: `
SELECT
  ip.subject_id,
  ip.instructor_id,
  ip.section,
  ip.paper_date,
  iq.question,
  iq.options,
  iq.correctOption,
  iq.image
FROM
  instructor_papers ip
JOIN
  instructor_paper_questions iq ON ip.paper_id = iq.instructor_paper_id
WHERE
  ip.subject_id = ?
ORDER BY
  ip.paper_date ASC;
`,

  GET_SUBMITTED_ASSIGNMENTS: `
select
		*
from
	assignment_submitted
inner join assignments on
	assignments.assignment_id = assignment_submitted.assignment_id
inner join subjects on
	assignments.subject_id = subjects.subject_id
where
	assignments.instructor_id = ?;
`,

  GET_SUBMITTED_ASSIGNMENTS_BY_SUBJECT_ID: `
select
*
from
assignment_submitted
inner join assignments on
assignments.assignment_id = assignment_submitted.assignment_id
inner join subjects on
assignments.subject_id = subjects.subject_id
where
assignments.instructor_id =?
and assignments.subject_id =?;
`,

  GET_SUBMITTED_ASSIGNMENTS_BY_STUDENT_ID: `
select
*
from
assignment_submitted
inner join assignments on
assignments.assignment_id = assignment_submitted.assignment_id
inner join subjects on
assignments.subject_id = subjects.subject_id
where
assignments.instructor_id =? and assignment_submitted.student_id =?;
`,

  // STUDENT____________________________________________________________________________________________________________

  ADD_STUDENT: `
    INSERT INTO student
    (user_id, register_id, status)
    VALUES (?, ?, ?)
  `,

  GET_USER_BY_STUDENT_ID: `
  SELECT
  users.first_name,
  users.last_name,
  CONCAT(users.first_name, ' ', users.last_name) AS full_name
FROM
  users
INNER JOIN
  student ON student.user_id = users.id
WHERE
  student.student_id = ?;
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
(student_id, quiz_id, total_marks, obtained_marks, grade, quiz_status)
VALUES(?, ?, ?, ?, ?, ?);

`,

  QUIZ_NOT_SUBMITTED: `
INSERT INTO quiz_submitted
(student_id, quiz_id)
VALUES(?, ?);

`,

  GET_ATTENDENCE: `
  SELECT * FROM student_attendence WHERE student_id=?;
`,

  GET_ATTENDENCE_SUBJECT_AND_STUDENT_ID: `
  select
	*
from
	student_attendence
	inner join subjects on
	subjects.subject_id = student_attendence.subject_id
where
	student_attendence.student_id = ?
	and student_attendence.subject_id =?;
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

  GET_COURSE_DETAILS_WITH_STUDENT_ID: `
  SELECT
  *
FROM
  courses
 JOIN student_enrollment ON student_enrollment.course_id = courses.course_id
WHERE
  student_enrollment.student_id = ?
;

`,

  GET_QUIZ: `
SELECT
*
FROM
quiz_question
INNER JOIN quiz ON quiz.quiz_id = quiz_question.quiz_id
LEFT jOIN program_plan ON program_plan.program_plan_id=quiz.program_plan_id
WHERE program_plan.course_id=?
`,
  GET_QUIZ_SUBMITTED: `
SELECT
* 
FROM
quiz_submitted
WHERE quiz_id =? and student_id=? 
`,

  GET_ASSIGNMENT_SUBMITTED: `
SELECT
*
FROM
assignment_submitted 
WHERE  assignment_id  =? and student_id=? 
`,

  GET_PAPER_SUBMITTED: `
SELECT
*
FROM
paper_submitted ps  
WHERE  paper_id  =? and student_id=?;
`,


  GET_QUIZ_STATUS: `
SELECT *
FROM quiz_submitted
WHERE student_id = ? AND quiz_id = ?;

`,

  GET_FINAL_PAPERS: `
  select
	incharge_papers.id,
	incharge_papers.title,
	incharge_papers.subject_id,
	subjects.subject_name 
from
	incharge_papers
inner join 
subjects on
	subjects.subject_id = incharge_papers.subject_id
where
	incharge_papers.subject_id = ?;
`,

  GET_FINAL_PAPERS_BY_SUBJECT_ID: `
select
	*
from
	incharge_papers
	inner join 
	incharge_paper_questions on incharge_paper_questions.incharge_paper_id =incharge_papers.id 
	inner join instructor_paper_questions on instructor_paper_questions.id =incharge_paper_questions.question_id 
where
	incharge_papers.subject_id  =?;
`,

  GET_QUIZ_BY_SUBJECT_ID: `
  select
  *
from
quiz  
inner join quiz_question on
quiz.quiz_id = quiz_question.quiz_id 
where
quiz.subject_id = ?;
`,

  GET_ASSIGNMENT_BY_SUBJECT_ID: `
select
*
from
 assignments
where subject_id = ?;
`,

  GET_ASSIGNMENTS: `
SELECT
*
FROM
assignments
LEFT jOIN program_plan ON program_plan.program_plan_id=assignments.program_plan_id
WHERE program_plan.course_id=?
`,

  //   GET_ASSIGNMENT_STATUS: `
  //   SELECT
  //   *
  // FROM
  //   assignment_submitted
  // INNER JOIN student ON assignment_submitted.student_id = student.student_id
  // INNER JOIN assignments ON assignments.assignment_id = assignment_submitted.assignment_id
  // LEFT JOIN program_plan ON program_plan.program_plan_id = assignments.program_plan_id
  // WHERE
  //   assignment_submitted.student_id = ? AND program_plan.course_id = ? AND assignment_submitted.assignment_id = ?
  // `,

  GET_ASSIGNMENT_STATUS: `
SELECT *
FROM assignment_submitted
WHERE student_id = ? AND assignment_id = ?;
`,

  GET_ALL_GRADES_QUIZES: `
SELECT
    *
FROM
    quiz_submitted
INNER JOIN quiz ON quiz.quiz_id = quiz_submitted.quiz_id
INNER JOIN program_plan ON program_plan.program_plan_id = quiz.program_plan_id
INNER JOIN course ON course.course_id = program_plan.course_id
WHERE
    quiz_submitted.student_id =? AND course.course_id=?`,

  GET_ALL_GRADES_ASSIGNMENTS: `
  SELECT
  *
FROM
  assignment_submitted
INNER JOIN assignments ON assignments.assignment_id = assignment_submitted.assignment_id
INNER JOIN program_plan ON program_plan.program_plan_id = assignments.program_plan_id
INNER JOIN course ON course.course_id = program_plan.course_id
WHERE
  assignment_submitted.student_id =? AND course.course_id=?`,

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
    (course_id, module_name,instructor_id)
    VALUES (?, ?, ?)
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
    (subject_id, class_date, class_time, class_link)
    VALUES(?, ?, ?, ?);
  `,

  GET_ALL_CLASSES: `
  SELECT *
  FROM time_table;
`,

  EDIT_CLASS_BY_ID: `
  UPDATE time_table
  SET ?
  WHERE class_id = ?;
`,

  DELETE_CLASS_BY_ID: `
  DELETE FROM time_table
  WHERE class_id = ?;
`,

  GET_CLASS_BY_ID: `
  SELECT *
  FROM time_table
  WHERE class_id = ?;
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

  EDIT_ITEM_BY_ID: `
  UPDATE inventory
  SET ?
  WHERE inventory_id = ?;
`,

  DELETE_ITEM_BY_ID: `
  DELETE FROM inventory
  WHERE inventory_id = ?;
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
  (course_id, student_id, enrollment_date, enrollment_status)
  VALUES(?, ?, ?, ?)
  `,

  CHECK_EXISTING_ENROLLMENT: `
  SELECT *
  FROM student_enrollment
  WHERE student_id = ? AND enrollment_status = 1
`,

  DELETE_ENROLLMENT_BY_ID: `
  DELETE FROM student_enrollment
  WHERE student_enrollment_id = ?;
`,
  //Get all enrolled students with details
  GET_ALL_ENROLLED_STUDENTS: `
  SELECT student_enrollment.*,courses.*,users.* from student_enrollment
  join users on student_enrollment.student_id= users.id
  join courses on student_enrollment.course_id=courses.course_id

`,

  // GET ENROLLMENT DETAILS FOR A SPECIFIC STUDENT

  GET_STUDENT_ENROLLMENT_DETAILS: `
  SELECT
    student_enrollment.*,
    program_plan.*,
    program.*,
    course.*
  FROM
    student_enrollment
  INNER JOIN program_plan ON student_enrollment.program_plan_id = program_plan.program_plan_id
  INNER JOIN program ON program_plan.program_id = program.program_id
  INNER JOIN course ON program_plan.course_id = course.course_id
  WHERE student_enrollment.student_id = ?
`,

  // UPDATE ENROLLED STATUS

  UPDATE_STUDENT_STATUS: `
  UPDATE student_enrollment
  SET enrollment_status = ?
  WHERE student_enrollment_id = ?
`,

  GET_ALL_ADMINS: `
    SELECT *
    FROM users
    inner join admin on admin.user_id = users.id 
    where admin.admin_type > 1
  `,

  GET_WHOLE_PROGRAM: `
    SELECT
    program.program_name,
    program.start_date,
    program.end_date,
    users.first_name,
    users.last_name,
    course.course_name,
    module.module_name,
    time_table.class_date,
    time_table.class_time
  FROM
    program
  INNER JOIN program_plan ON program_plan.program_id = program.program_id
  INNER JOIN time_table on time_table.program_plan_id=program_plan.program_plan_id
  // INNER JOIN instructor ON instructor.instructor_id = module.instructor_id
  RIGHT JOIN users ON users.id = instructor.user_id
  INNER JOIN course ON program_plan.course_id = course.course_id
  INNER JOIN module ON module.course_id = course.course_id
  `,

  GET_AVG_ATTENDANCE: `
  select
	AVG(attendence_status) as average_attendance
  from
	student_attendence
  where
	student_id = ?
	and attendence_status = ?;
  `,
  GET_AVG_QUIZ_MARKS: `
  select
	AVG(total_marks) as average_quiz_marks
  from
	quiz_submitted 
  where
	student_id = ?;`,

  GET_AVG_ASSIGNMENT_MARKS: `
  select
	AVG(marks) as average_assignment_marks
from
	assignment_submitted 
where
	student_id = ?;`,

  GET_AVG_QUIZ_MARKS_PER_SUBJECT: `
  select
	AVG(total_marks) as average_subject_quiz_marks
from
	quiz_submitted
inner join quiz on
	quiz.quiz_id = quiz_submitted.quiz_id
where
	student_id = ?
	and quiz.subject_id = ?;`,

  GET_AVG_ASSIGNMENT_MARKS_PER_SUBJECT: `
  select
	AVG(marks) as average_subject_assignment_marks
from
	assignment_submitted 
inner join assignments on
	assignments.assignment_id  = assignment_submitted.assignment_id 
where
	student_id = ?
	and assignments.subject_id = ?;`,

  GET_AVG_ATTENDANCE_PER_SUBJECT: `
  select
	AVG(attendence_status) as average_subject_attendance
from
	student_attendence
where
	student_id = ?
	and attendence_status = ?
	and subject_id = ?;
  `,

  //   SELECT
  //     program.program_id,
  //     program.program_name,
  //     program.start_date,
  //     program.end_date,
  //     users.first_name,
  //     users.last_name,
  //     course.course_name,
  //     time_table.class_date,
  //     time_table.class_time
  //   FROM
  //     program
  //   LEFT JOIN program_plan ON program_plan.program_id = program.program_id
  //   INNER JOIN instructor ON instructor.instructor_id = program_plan.instructor_id
  //   RIGHT JOIN users ON users.id = instructor.user_id
  //   INNER JOIN course ON program_plan.course_id = course.course_id
  //   INNER JOIN module ON module.course_id = course.course_id
  //   LEFT JOIN time_table ON time_table.program_plan_id = program_plan.program_plan_id
  // `,
};
