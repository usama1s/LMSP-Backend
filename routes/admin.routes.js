const express = require('express');
const adminController = require('../controllers/admin.controller');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});
const upload = multer({ storage });

router.post('/add-item', upload.fields([
    { name: 'information_file' },
    { name: 'video_file' },
    { name: 'image_1' },
    { name: 'image_2' },
    { name: 'image_3' },
    { name: 'image_4' },
    { name: 'image_5' },
    { name: 'image_6' },
    { name: 'image_7' },
    { name: 'image_8' },
    { name: 'image_9' },
    { name: 'image_10' },
]), adminController.addItem);

router.get('/get-all-item', adminController.getAllItems);
router.get('/get-item/:inventoryId', adminController.getItemById);
router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    res.sendFile(filename, { root: 'uploads' });
});


module.exports = router;
