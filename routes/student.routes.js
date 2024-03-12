const express = require("express");
const studentController = require("../controllers/student.controller");
const router = express.Router();

// ROUTES

router.post("/submit-quiz", studentController.submitQuiz);
router.post("/submit-assignment", studentController.submitAssignment);
router.post("/submit-paper", studentController.submitPaper);

router.get("/get-quiz/:student_id/:course_id", studentController.getQuiz);
router.get("/get-papers/:student_id/:course_id", studentController.getPaper);

router.get(
  "/get-assignment/:student_id/:course_id",
  studentController.getAssignment
);
router.get("/get-attendence/:student_id", studentController.getAttendence);
router.get(
  "/get-attendence-for-chart/:student_id/:course_id/:program_id",
  studentController.getAttendenceForChart
);
router.get(
  "/get-course/:student_id",
  studentController.getCourseDetailsWithStudentId
);
router.post("/quiz-not-submitted", studentController.quizNotSubmit);
router.get("/get-all-grades/:student_id", studentController.getAllGrades);
router.post(
  "/assignment-not-submitted",
  studentController.assignmentNotSubmitted
);
router.get("/get-notifications", studentController.getNotifications);
router.post("/submit-course-feedback", studentController.submitCourseFeedback);
router.get(
  "/get-course-feedback-by-student/:student_id",
  studentController.getStudentEnrolledCoursesFeedback
);

module.exports = router;
