const sql = require("../services/sql.service");
const pool = require("../db.conn");

module.exports = {
  // INSTRUCTOR ADD QUIZES
  async addQuiz(subject_id, instructor_id, quiz_date, section) {
    try {
      const [addQuiz] = await pool.query(sql.ADD_QUIZ, [
        subject_id,
        instructor_id,
        quiz_date,
        section,
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
    assignment_date,
    assignmentFilePath,
    assignment_instruction,
    assignment_title,
    subject_id,
    instructor_id,
    section
  ) {
    try {
      const [addAssignment] = await pool.query(sql.ADD_ASSIGNMENT, [
        assignment_date,
        assignmentFilePath,
        assignment_instruction,
        assignment_title,
        subject_id,
        instructor_id,
        section,
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
  async markAttendence(students, attendence_date, subject_id, section) {
    try {
      for (const student of students) {
        await pool.query(sql.MARK_ATTENDENCE, [
          student.student_id,
          student.attendence_status,
          attendence_date,
          subject_id,
          section,
        ]);
      }
      return { message: "Attendence added successfully." };
    } catch (error) {
      console.log(error);
    }
  },

  // INSTRUCTOR ADD ASSIGNMENTS
  async getStudents(program_plan_id, date) {
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

  async addPaper(subject_id, instructor_id, paper_date, section, title) {
    try {
      const [addPaper] = await pool.query(sql.ADD_PAPER, [
        subject_id,
        instructor_id,
        paper_date,
        section,
        title,
      ]);
      return addPaper.insertId;
    } catch (error) {
      throw error("error inserting paper");
    }
  },

  async addPaperQuestion(
    paperId,
    question,
    options,
    question_image_path,
    question_video_path,
    correctOption,
    title
  ) {
    const option1 = options[0];
    const option2 = options[1];
    const option3 = options[2];
    const option4 = options[3];
    await pool.query(sql.ADD_PAPER_QUESTION, [
      paperId,
      title,
      question,
      option1,
      option2,
      option3,
      option4,
      question_image_path,
      question_video_path,
      correctOption,
    ]);
  },

  async getInstructorPapersBySubject(subjectId) {
    try {
      const [papers] = await pool.query(
        sql.GET_INSTRUCTOR_PAPERS_BY_SUBJECT_AND_DATE,
        [subjectId]
      );
      return papers;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching instructor papers");
    }
  },

  async editPaper(
    paper_id,
    subject_id,
    instructor_id,
    paper_date,
    section,
    title
  ) {
    try {
      await pool.query(sql.EDIT_PAPER, [
        subject_id,
        instructor_id,
        paper_date,
        section,
        title,
        paper_id,
      ]);
    } catch (error) {
      throw new Error("Error updating paper");
    }
  },

  async editPaperQuestion(
    question_id,
    title,
    question,
    options,
    question_image_path,
    question_video_path,
    correctOption
  ) {
    const option1 = options[0];
    const option2 = options[1];
    const option3 = options[2];
    const option4 = options[3];

    await pool.query(sql.EDIT_PAPER_QUESTION, [
      title,
      question,
      option1,
      option2,
      option3,
      option4,
      question_image_path,
      question_video_path,
      correctOption,
      question_id,
    ]);
  },
  //Delete paper questions
  async deletePaperQuestions(paper_id) {
    try {
      await pool.query(sql.DELETE_PAPER_QUESTIONS, [paper_id]);
    } catch (error) {
      throw new Error("Error deleting paper questions");
    }
  },
  // Delete Instructor Paper
  async deleteInstructorPaper(paperId) {
    try {
      await pool.query(sql.DELETE_INSTRUCTOR_PAPER, [paperId]);
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting instructor paper");
    }
  },
};
