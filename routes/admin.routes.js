const express = require("express");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

// ROUTES
router.post("/add-full-course-details", adminController.addCourseFullDetails);
router.post("/add-item", adminController.addItem);
router.post("/add-program", adminController.addProgram);
router.post("/add-program_plan", adminController.addProgramPlan);
router.post("/add-class", adminController.addClass);
router.post("/enroll-student", adminController.enrollStudent);

router.get("/get-item/:inventoryId", adminController.getItemById);
router.get("/get-all-users", adminController.getAllUsers);
router.get("/get-all-item", adminController.getAllItems);
router.get("/get-all-courses", adminController.getAllCourses);
router.get("/get-all-instructors", adminController.getAllInstructor);
router.get("/get-all-program_plan", adminController.getAllProgramPlan);
router.get("/get-whole-program", adminController.getWholeProgram);

router.get("/get-all-admins", adminController.getAllAdmins);
router.get(
  "/get-all-students-with-enrollment",
  adminController.getAllStudentsWithEnrollment
);
router.put(
  "/update-student-enrollment-status",
  adminController.updateStudentStatus
);

module.exports = router;

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + '-' + file.originalname);
//     },
// });
// const uploadPath = path.join(__dirname, '../uploads');

// const upload = multer({ storage })

// router.post('/add-item', upload.fields([
//     { name: 'information_file' },
//     { name: 'video_file' },
//     { name: 'image_1' },
//     { name: 'image_2' },
//     { name: 'image_3' },
//     { name: 'image_4' },
//     { name: 'image_5' },
//     { name: 'image_6' },
//     { name: 'image_7' },
//     { name: 'image_8' },
//     { name: 'image_9' },
//     { name: 'image_10' },
// ]), adminController.addItem);

// router.post('/add-module', adminController.addModule);
// router.post('/add-topic', adminController.addTopic);
