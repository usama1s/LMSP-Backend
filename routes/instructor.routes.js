const express = require('express');
const instructorController = require('../controllers/instructor.controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});
const uploadPath = path.join(__dirname, '../uploads');

const upload = multer({ storage });

router.post('/add-quiz', instructorController.addQuiz);

// router.get('/add-assignment', upload.single('assignment_file') ,instructorController.addAssignment);

module.exports = router;

