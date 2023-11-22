const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

// ROUTES

router.post('/submit-quiz', studentController.submitQuiz);
router.post('/submit-assignment', studentController.submitAssignment);
router.get('/get-quiz/:student_id', studentController.getQuiz);
router.get('/get-attendence/:student_id', studentController.getAttendence);


module.exports = router;

