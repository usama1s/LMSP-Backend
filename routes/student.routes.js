const express = require('express');
const studentController = require('../controllers/student.controller');
const router = express.Router();

// ROUTES

router.post('/submit-quiz', studentController.submitQuiz);
router.post('/submit-assignment', studentController.submitAssignment);
router.get('/get-quiz', studentController.getQuiz);


module.exports = router;

