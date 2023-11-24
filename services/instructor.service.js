const sql = require("../services/sql.service");
const pool = require("../db.conn");

module.exports = {
  // INSTRUCTOR ADD QUIZES
  async addQuiz(program_plan_id, quiz_date) {
    try {
      const [addQuiz] = await pool.query(sql.ADD_QUIZ, [
        program_plan_id,
        quiz_date,
      ]);
      return addQuiz.insertId;
    } catch (error) {
      throw error("error inserting quiz");
    }
  },

  // ADD QUESTION WITH QUIZ ID
  async addQuizQuestion(
    quizId,
    question,
    options,
    quiz_image_path,
    correctOption
  ) {
    const option1 = options[0];
    const option2 = options[1];
    const option3 = options[2];
    const option4 = options[3];
    await pool.query(sql.ADD_QUIZ_QUESTION, [
      quizId,
      question,
      option1,
      option2,
      option3,
      option4,
      quiz_image_path,
      correctOption,
    ]);
  },

  // INSTRUCTOR ADD ASSIGNMENTS
  async addAssignment(
    program_plan_id,
    assignment_date,
    assignmentFilePath,
    assignment_instruction,
    assignment_title
  ) {
    try {
      const [addAssignment] = await pool.query(sql.ADD_ASSIGNMENT, [
        program_plan_id,
        assignment_date,
        assignmentFilePath,
        assignment_instruction,
        assignment_title,
      ]);
    } catch (error) {
      console.log(error);
    }
  },

  // MARK ATTENDENCE OF STUDENT
  async markAttendence(students, attendence_date) {
    try {
      for (const student of students) {
        await pool.query(sql.MARK_ATTENDENCE, [
          student.student_id,
          student.attendence_status,
          attendence_date,
        ]);
      }
      return { message: "Attendence added successfully." };
    } catch (error) {
      console.log(error);
    }
  },

  // INSTRUCTOR ADD ASSIGNMENTS
  async getStudents(program_plan_id) {
    try {
      const [students] = await pool.query(sql.GET_STUDENTS_PROGRAM_PLAN, [
        program_plan_id,
      ]);
      return students;
    } catch (error) {
      console.log(error);
    }
  },
};
