const express = require('express');
const instructorController = require('../controllers/instructor.controller');
const router = express.Router();

// ROUTES

router.post('/add-quiz', instructorController.addQuiz);
router.post('/add-assignment' ,instructorController.addAssignment);
router.post('/mark-attendence' ,instructorController.markAttendence);


module.exports = router;

