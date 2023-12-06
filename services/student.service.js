const sql = require("../services/sql.service");
const pool = require("../db.conn");

module.exports = {
  // SUBMIT QUIZ
  async submitQuiz(submittedQuizDetails) {
    const { student_id, quiz_id, total_marks, obtained_marks, grade, status } =
      submittedQuizDetails;
    await pool.query(sql.QUIZ_SUBMISSION, [
      student_id,
      quiz_id,
      total_marks,
      obtained_marks,
      grade,
      status,
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

  // GET QUIZ STATUS
  async getQuiz(student_id, course_id) {
    try {
      const [quizzes] = await pool.query(sql.GET_QUIZ, course_id);

      const quizToAttempt = [];

      for (const quiz of quizzes) {
        const [quizStatus] = await pool.query(sql.GET_QUIZ_STATUS, [
          student_id,
          quiz.quiz_id,
        ]);

        if (quizStatus.length === 0) {
          quizToAttempt.push(quiz);
        }
      }
      const modifiedResult = {
        quizData: {
          ...quizToAttempt.reduce((acc, quiz) => {
            const quizId = quiz.quiz_id;
            acc[quizId] = acc[quizId] || [];
            acc[quizId].push(quiz);
            return acc;
          }, {}),
        },
      };

      return modifiedResult;
    } catch (error) {
      console.log(error);
    }
  },

  // GET ASSIGNMENT
  async getAssignment(student_id, course_id) {
    try {
      const [assignments] = await pool.query(sql.GET_ASSIGNMENTS, course_id);

      const assignmentsToAttempt = [];
      for (const assignment of assignments) {
        const [assignmentStatus] = await pool.query(sql.GET_ASSIGNMENT_STATUS, [
          student_id,
          // course_id,
          assignment.assignment_id,
        ]);
        if (assignmentStatus.length == 0) {
          assignmentsToAttempt.push(assignment);
        }
      }
      const modifiedResult = {
        assignmentData: {
          ...assignmentsToAttempt.reduce((acc, assignment) => {
            const assignment_id = assignment.assignment_id;
            acc[assignment_id] = acc[assignment_id] || [];
            acc[assignment_id].push(assignment);
            return acc;
          }, {}),
        },
      };

      return modifiedResult;
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

  // GET ATTENDENCE FOR PIE CHART
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

  // GET ATTENDENCE FOR PIE CHART
  async getCourseDetailsWithStudentId(student_id) {
    try {
      const [course] = await pool.query(
        sql.GET_COURSE_DETAILS_WITH_STUDENT_ID,
        [student_id]
      );
      return course;
    } catch (error) {
      console.log(error);
    }
  },

  // GET GRADES
  async getAllGrades(student_id, course_id) {
    try {
      const [quizes] = await pool.query(sql.GET_ALL_GRADES_QUIZES, [
        student_id,
        course_id,
      ]);
      const [assignments] = await pool.query(sql.GET_ALL_GRADES_ASSIGNMENTS, [
        student_id,
        course_id,
      ]);
      return [{ quizes }, { assignments }];
    } catch (error) {
      console.log(error);
    }
  },
};
