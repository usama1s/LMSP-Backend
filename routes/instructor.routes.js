const express = require("express");
const instructorController = require("../controllers/instructor.controller");
const sql = require("../services/sql.service");
const pool = require("../db.conn");
const router = express.Router();

// ROUTES

router.post("/add-quiz", instructorController.addQuiz);
router.post("/add-assignment", instructorController.addAssignment);
router.get(
  "/get-students-by-program-plan/:program_plan_id/:date",
  instructorController.getStudents
);
router.get(
  "/get-courses-by-instructor/:instructor_id",
  instructorController.getCoursesByInstructorId
);

router.post("/mark-attendence", instructorController.markAttendence);
router.post("/add-paper", instructorController.addPaper);
router.get(
  "/papers/instructors/:subject_id/:paper_date",
  instructorController.getInstructorPapersBySubject
);
router.put("/edit-paper/:id", instructorController.editPaper);
router.put("/delete-paper/:id", instructorController.deleteInstructorPaper);

// Get subjects and courses of an instructor
router.get("/:instructorId/subjects", async (req, res) => {
  const instructorId = req.params.instructorId;

  try {
    const subjectsQuery = `
      SELECT 
        subjects.subject_id, 
        subjects.subject_name, 
        instructor_subject.section,
        courses.course_id,
        courses.course_name
      FROM subjects
      JOIN instructor_subject ON subjects.subject_id = instructor_subject.subject_id
      JOIN modules ON subjects.module_id = modules.module_id
      JOIN courses ON modules.course_id = courses.course_id
      WHERE instructor_subject.instructor_id = ?
    `;
    const subjectsResult = await pool.query(subjectsQuery, [instructorId]);
    const subjects = subjectsResult[0];

    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error getting subjects of an instructor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
