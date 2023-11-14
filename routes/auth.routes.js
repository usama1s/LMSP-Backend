const express = require('express');
const authController = require('../controllers/auth.controller');
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
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Adjust the size limit as needed
});

//ROUTES
router.post('/register', authController.register);
router.post('/sign-in', authController.signIn);


module.exports = router;
