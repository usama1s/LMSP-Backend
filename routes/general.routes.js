const express = require('express');
const router = express.Router();
const generalController = require('../controllers/general.controller');



router.get('/uploads/:filename', generalController.serveFile);
router.get('/get-all-students', generalController.getAllStudents);
router.get('/get-all-students-with-programs', generalController.getAllStudentsWithPrograms);


module.exports = router;
