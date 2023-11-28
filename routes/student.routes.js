const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

// ROUTES

router.post('/submit-quiz', studentController.submitQuiz);
router.post('/submit-assignment', studentController.submitAssignment);
router.get('/get-quiz/:student_id/:course_id', studentController.getQuiz);
router.get('/get-assignment/:student_id/:course_id', studentController.getAssignment);
router.get('/get-attendence/:student_id', studentController.getAttendence);
router.get('/get-attendence-for-chart/:student_id/:course_id/:program_id', studentController.getAttendenceForChart);
router.get('/get-course/:student_id', studentController.getCourseDetailsWithStudentId);
router.post('/quiz-not-submitted', studentController.quizNotSubmit);
router.get('/get-my-grades/:student_id/:course_id', studentController.getAllGrades);

router.post('/assignment-not-submitted', studentController.assignmentNotSubmitted);


module.exports = router;

