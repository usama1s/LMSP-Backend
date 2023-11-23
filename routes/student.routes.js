const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

// ROUTES

router.post('/submit-quiz', studentController.submitQuiz);
router.post('/submit-assignment', studentController.submitAssignment);
router.post('/assignment-not-submitted', studentController.assignmentNotSubmitted);
router.post('/quiz-not-submitted', studentController.quizNotSubmit);
router.get('/get-quiz/:student_id', studentController.getQuiz);
router.get('/get-attendence/:student_id', studentController.getAttendence);
router.get('/get-attendence-for-chart/:student_id/:course_id/:program_id', studentController.getAttendenceForChart);



module.exports = router;

