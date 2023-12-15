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

  //EDIT QUIZ
  async editQuizById(quizId, updatedQuizData) {
    try {
      await pool.query(sql.EDIT_QUIZ_BY_ID, [updatedQuizData, quizId]);
      return "Quiz details updated successfully";
    } catch (error) {
      throw error;
    }
  },

  //DELETE QUIZ
  async deleteQuizById(quizId) {
    try {
      await pool.query(sql.DELETE_QUIZ_BY_ID, [quizId]);
      return "Quiz deleted successfully";
    } catch (error) {
      throw error;
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

  //EDIT Assignment

  async editAssignmentById(assignmentId, updatedAssignmentData) {
    try {
      await pool.query(sql.EDIT_ASSIGNMENT_BY_ID, [
        updatedAssignmentData,
        assignmentId,
      ]);
      return "Assignment details updated successfully";
    } catch (error) {
      throw error;
    }
  },

  //DELETE ASSIGNMENT

  async deleteAssignmentById(assignmentId) {
    try {
      await pool.query(sql.DELETE_ASSIGNMENT_BY_ID, [assignmentId]);
      return "Assignment deleted successfully";
    } catch (error) {
      throw error;
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
  async getStudents(program_plan_id, date) {
    console.log("DATE", date);
    try {
      const [students] = await pool.query(sql.GET_STUDENTS_PROGRAM_PLAN, [
        program_plan_id,
        date,
      ]);
      return students;
    } catch (error) {
      console.log(error);
    }
  },

  // GET COURSES BY INSTRUCTOR ID
  async getCoursesByInstructorId(instructor_id) {
    try {
      const [courses] = await pool.query(sql.GET_COURSES_BY_INSTRUCTOR, [
        instructor_id,
      ]);
      return courses;
    } catch (error) {
      console.log(error);
    }
  },
};
