const express = require('express');
const router = express.Router();
const generalController = require('../controllers/general.controller');



router.get('/uploads/:filename', generalController.serveFile);
router.get('/get-all-students', generalController.getAllStudents);


module.exports = router;
