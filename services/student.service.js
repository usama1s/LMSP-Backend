const sql = require("../services/sql.service");
const pool = require("../db.conn");

module.exports = {
  // SUBMIT QUIZ
  async submitQuiz(submittedQuizDetails) {
    const { student_id, quiz_id, total_marks, obtained_marks, grade } =
      submittedQuizDetails;
    await pool.query(sql.QUIZ_SUBMISSION, [
      student_id,
      quiz_id,
      total_marks,
      obtained_marks,
      grade,
    ]);
    return { message: "Quiz submitted successfully." };
  },

  // QUIZ NOT SUBMITTED
  async quizNotSubmit(submittedQuizDetails) {
    const { student_id, quiz_id } = submittedQuizDetails;
    await pool.query(sql.QUIZ_NOT_SUBMITTED, [student_id, quiz_id]);
    return { message: "Quiz not submitted." };
  },

  // SUBMIT ASSIGNMENT
  async submitAssignment(
    student_id,
    assignment_id,
    submittedFilePath,
    marks,
    grade
  ) {
    try {
      await pool.query(sql.ASSIGNMENT_SUBMISSION, [
        student_id,
        assignment_id,
        submittedFilePath,
        marks,
        grade,
      ]);
      return { message: "Assignment submitted successfully." };
    } catch (error) {
      console.log(error);
    }
  },

  // ASSIGNMENT NOT SUBMIT
  async assignmentNotSubmitted(student_id, assignment_id) {
    try {
      await pool.query(sql.ASSIGNMENT_NOT_SUBMISSION, [
        student_id,
        assignment_id,
      ]);
      return { message: "Assignment not submitted." };
    } catch (error) {
      console.log(error);
    }
  },

  // GET QUIZ
  async getQuiz(student_id) {
    try {
      const [quiz] = await pool.query(sql.GET_QUIZ, student_id);
      return { quiz };
    } catch (error) {
      console.log(error);
    }
  },

  // GET QUIZ
  async getAttendence(student_id) {
    try {
      const [attendence] = await pool.query(sql.GET_ATTENDENCE, student_id);
      if (attendence.length > 0) {
        return { attendence };
      } else {
        return { message: "attendence is not avalaible" };
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getAttendenceForChart(student_id, course_id, program_id) {
    try {
      const [totalPresents] = await pool.query(sql.GET_ATTENDENCE_FOR_CHART, [
        course_id,
        student_id,
        1,
        program_id,
      ]);
      const [totalAbsents] = await pool.query(sql.GET_ATTENDENCE_FOR_CHART, [
        course_id,
        student_id,
        0,
        program_id,
      ]);
      return [totalPresents[0], totalAbsents[0]];
    } catch (error) {
      console.log(error);
    }
  },
};
