const studentService = require("../services/student.service");
const convertBase64 = require("../util/convert.base64.js");

module.exports = {
  // SUBMIT QUIZ
  async submitQuiz(req, res) {
    try {
      const submittedQuizDetails = req.body;
      const quizSubmitted = await studentService.submitQuiz(
        submittedQuizDetails
      );
      res.status(200).json(quizSubmitted.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // SUBMIT ASSIGNMENT
  async submitAssignment(req, res) {
    try {
      const submittedAssignmentDetails = req.body;
      const { student_id, assignment_id, submitted_file, marks, grade } =
        submittedAssignmentDetails;
      const submittedFilePath = await convertBase64.base64ToPdf(submitted_file);
      const assignmentSubmitted = await studentService.submitAssignment(
        student_id,
        assignment_id,
        submittedFilePath,
        marks,
        grade
      );
      res.status(200).json(assignmentSubmitted.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ASSIGNMENT NOT SUBMITTED
  async quizNotSubmit(req, res) {
    try {
      const submittedAssignmentDetails = req.body;
      const { student_id, quizNotSubmit } = submittedAssignmentDetails;
      const assignmentSubmitted = await studentService.quizNotSubmit(
        student_id,
        quizNotSubmit
      );
      res.status(200).json(assignmentSubmitted.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // ASSIGNMENT NOT SUBMITTED
  async assignmentNotSubmitted(req, res) {
    try {
      const submittedAssignmentDetails = req.body;
      const { student_id, assignment_id } = submittedAssignmentDetails;
      const assignmentSubmitted = await studentService.assignmentNotSubmitted(
        student_id,
        assignment_id
      );
      res.status(200).json(assignmentSubmitted.message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET QUIZ 
  async getQuiz(req, res) {
    try {
      const { student_id, course_id } = req.params;
      const quiz = await studentService.getQuiz(
        student_id,
        course_id,
      );
      res.status(200).json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET ASSIGNMENT
  async getAssignment(req, res) {
    try {
      const { student_id, course_id } = req.params;
      const Assignment = await studentService.getAssignment(
        student_id,
        course_id
      );
      res.status(200).json(Assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET ATTENDENCE OF SPECIFIC ID
  async getAttendence(req, res) {
    try {
      const student_id = req.params.student_id;
      const attendence = await studentService.getAttendence(student_id);
      res.status(200).json(attendence);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET ATTENDENCE FOR PIE CHART
  async getAttendenceForChart(req, res) {
    try {
      const { student_id, course_id, program_id } = req.params;
      const attendenceForChart = await studentService.getAttendenceForChart(
        student_id,
        course_id,
        program_id
      );
      res.status(200).json(attendenceForChart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET COURSE WITH COURSE ID
  async getCourseDetailsWithStudentId(req, res) {
    try {
      const { student_id } = req.params;
      const course = await studentService.getCourseDetailsWithStudentId(
        student_id
      );
      res.status(200).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // GET GRADES
  async getAllGrades(req, res) {
    try {
      const { student_id, course_id } = req.params;
      const grades = await studentService.getAllGrades(
        student_id,
        course_id
      );
      res.status(200).json(grades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
