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
const upload = multer({ storage });

//ROUTES
router.post('/register', upload.single('profile_image'), authController.register);
router.post('/sign-in', authController.signIn);


module.exports = router;
