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
      const [total_marks] = await pool.query(
        `SELECT assignment_total_marks FROM assignments where assignment_id=${assignment_id}`
      );
      await pool.query(sql.ASSIGNMENT_SUBMISSION, [
        student_id,
        assignment_id,
        submittedFilePath,
        total_marks[0].assignment_total_marks,
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

  //SUBMIT COURSE FEEDBACK
  async submitCourseFeedback(course_feedback_question_id, answer, student_id) {
    try {
      await pool.query(sql.SUBMIT_COURSE_FEEDBACK, [
        course_feedback_question_id,
        answer,
        student_id,
      ]);
      return { message: "Feedback submitted successfully." };
    } catch (err) {
      console.log(err);
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

  async getPaper(student_id, course_id) {
    try {
      const [papers] = await pool.query(sql.GET_PAPER, course_id);

      const paperToAttempt = [];
      for (const paper of papers) {
        const [paperStatus] = await pool.query(sql.GET_PAPER_STATUS, [
          student_id,
          paper.incharge_paper_id,
        ]);

        if (paperStatus.length === 0) {
          paperToAttempt.push(paper);
        }
      }
      const groupedPapers = paperToAttempt.reduce((acc, paper) => {
        const paperId = paper.incharge_paper_id;

        if (!acc[paperId]) {
          acc[paperId] = {
            id: paperId,
            title: paper.title,
            paper_date: paper.paper_date,
            paper_time: paper.paper_time,
            subject_id: paper.subject_id,
            section: paper.section,
            admin_id: paper.admin_id,
            subject_name: paper.subject_name,
            course_name: paper.course_name,
            course_id: paper.course_id,
            questions: [],
          };
        }

        acc[paperId].questions.push({
          question_id: paper.question_id,
          instructor_paper_id: paper.instructor_paper_id,
          question: paper.question,
          options: [
            paper.option_1,
            paper.option_2,
            paper.option_3,
            paper.option_4,
          ],
          correctOption: paper.answer,
          question_picture: paper.question_picture,
          question_video: paper.question_video,
        });

        return acc;
      }, {});

      const resultArray = Object.values(groupedPapers);

      return resultArray;
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

  // SHOW NOTIFICATION
  async getNotificationToShow() {
    try {
      const notifications = await pool.query(sql.SHOW_NOTIFICATION);
      return [notifications[0]];
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
  async getAllGrades(student_id) {
    try {
      quizGrades = [];
      assignmentGrades = [];
      paperGrades = [];

      const [quizes] = await pool.query(sql.GET_ALL_GRADES_QUIZES, [
        student_id,
      ]);
      for (quiz of quizes) {
        quizGrades.push(quiz);
      }

      const modifiedQuizGrades = quizGrades.map((quiz) => ({
        quiz_submitted_id: quiz.quiz_submitted_id,
        student_id: quiz.student_id,
        quiz_id: quiz.quiz_id,
        total_marks: quiz.total_marks,
        obtained_marks: quiz.obtained_marks,
        grade: quiz.grade,
        quiz_status: quiz.quiz_status,
        percentage: quiz.percentage,
        quiz_date: quiz.quiz_date,
        subject_id: quiz.subject_id,
        instructor_id: quiz.instructor_id,
        section: quiz.section,
      }));

      const [assignments] = await pool.query(sql.GET_ALL_GRADES_ASSIGNMENTS, [
        student_id,
      ]);
      for (assignment of assignments) {
        assignmentGrades.push(assignment);
      }

      const modifiedAssignmentGrades = assignmentGrades.map((assignment) => ({
        assignment_submitted_id: assignment.assignment_submitted_id,
        student_id: assignment.student_id,
        assignment_id: assignment.assignment_id,
        submitted_file: assignment.submitted_file,
        marks: assignment.marks,
        grade: assignment.grade,
        assignment_status: assignment.assignment_status,
        percentage: assignment.percentage,
        assignment_date: assignment.assignment_date,
        assignment_file: assignment.assignment_file,
        assignment_instruction: assignment.assignment_instruction,
        assignment_title: assignment.assignment_title,
        subject_id: assignment.subject_id,
        instructor_id: assignment.instructor_id,
      }));

      const [papers] = await pool.query(sql.GET_ALL_GRADES_PAPERS, [
        student_id,
      ]);
      for (paper of papers) {
        paperGrades.push(paper);
      }

      const modifiedPaperGrades = paperGrades.map((paper) => ({
        paper_submitted_id: paper.paper_submitted_id,
        student_id: paper.student_id,
        paper_id: paper.paper_id,
        total_marks: paper.total_marks,
        obtained_marks: paper.obtained_marks,
        grade: paper.grade,
        percentage: paper.percentage,
        paper_date: paper.paper_date,
        subject_id: paper.subject_id,
        instructor_id: paper.instructor_id,
        section: paper.section,
      }));

      return {
        quizGrades: modifiedQuizGrades,
        assignmentGrades: modifiedAssignmentGrades,
        paperGrades: modifiedPaperGrades,
      };
    } catch (error) {
      console.log(error);
    }
  },

  //STUDENT ENROLLED COURSES FEEDBACK IDS
  async getStudentEnrolledCoursesFeedback(student_id) {
    try {
      const [courseFeedBack] = await pool.query(
        sql.GET_STUDENT_ENROLLED_COURSES_FEEDBACK_ID,
        [student_id]
      );
      return courseFeedBack;
    } catch (error) {
      throw new Error("Error getting student enrolled courses feedback");
    }
  },
};
