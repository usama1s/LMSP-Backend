const express = require('express');
const instructorController = require('../controllers/instructor.controller');
const router = express.Router();

// ROUTES

router.post('/add-quiz', instructorController.addQuiz);
router.post('/add-assignment' ,instructorController.addAssignment);
router.get('/get-students-by-program-plan/:program_plan_id' ,instructorController.getStudents);
router.get('/get-courses-by-instructor/:instructor_id' ,instructorController.getCoursesByInstructorId);

router.post('/mark-attendence' ,instructorController.markAttendence);


module.exports = router;

