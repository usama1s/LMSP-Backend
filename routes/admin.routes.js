const express = require("express");
const sql = require("../services/sql.service");
const pool = require("../db.conn");
const adminController = require("../controllers/admin.controller");
const router = express.Router();
const convertBase64 = require("../util/convert.base64.js");

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

router.post("/addCourse", async (req, res) => {
  const data = req.body;

  try {
    const outlineFilePath = await convertBase64.base64ToPdf(data.outline_file);
    const courseQuery =
      "INSERT INTO courses (course_name, course_description, outline_file, prerequisites, learning_outcomes, classroom_material, reference_books) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const courseValues = [
      data.course_name,
      data.course_description,
      outlineFilePath,
      data.prerequisites,
      data.learning_outcomes,
      data.classroom_material,
      data.reference_books,
    ];
    const courseResult = await pool.query(courseQuery, courseValues);
    const courseId = courseResult[0].insertId; // Accessing the first result in the result array

    for (const module of data.modules) {
      const moduleQuery =
        "INSERT INTO modules (course_id, module_name) VALUES (?, ?)";
      const moduleValues = [courseId, module.module_name];

      const moduleResult = await pool.query(moduleQuery, moduleValues);
      const moduleId = moduleResult[0].insertId;

      for (const subject of module.subjects) {
        const subjectQuery =
          "INSERT INTO subjects (module_id, subject_name) VALUES (?, ?)";
        const subjectValues = [moduleId, subject.subject_name];

        const subjectResult = await pool.query(subjectQuery, subjectValues);
        const subjectId = subjectResult[0].insertId;

        for (const teacher of subject.teachers) {
          const teacherId = teacher.teacherID;

          const teacherSubjectQuery =
            "INSERT INTO instructor_subject (instructor_id, subject_id, section) VALUES (?, ?, ?)";
          const teacherSubjectValues = [teacherId, subjectId, teacher.section];

          await pool.query(teacherSubjectQuery, teacherSubjectValues);
        }

        for (const topic of subject.topics) {
          const topicQuery =
            "INSERT INTO topics (subject_id, topic_name, lecture_file_name, lecture_file_type, lecture_file) VALUES (?, ?, ?, ?, ?)";
          const topicValues = [
            subjectId,
            topic.topic_name,
            topic.lecture_file_name,
            topic.lecture_file_type,
            topic.lecture_file,
          ];

          await pool.query(topicQuery, topicValues);
        }
      }
    }

    res.status(200).json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error during database insertion:", error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

// -------------------------------------      GET COURSE BY ID ---------------------------------- //

router.get("/getCourse/:courseId", async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Get course details
    const courseQuery = "SELECT * FROM courses WHERE course_id = ?";
    const courseResult = await pool.query(courseQuery, [courseId]);
    const course = courseResult[0][0];

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get modules for the course
    const modulesQuery = "SELECT * FROM modules WHERE course_id = ?";
    const modulesResult = await pool.query(modulesQuery, [courseId]);
    const modules = modulesResult[0];

    for (const module of modules) {
      const subjectsQuery = "SELECT * FROM subjects WHERE module_id = ?";
      const subjectsResult = await pool.query(subjectsQuery, [
        module.module_id,
      ]);
      const subjects = subjectsResult[0];

      for (const subject of subjects) {
        const teachersQuery = `
          SELECT instructor.*, instructor_subject.section
          FROM instructor
          JOIN instructor_subject ON instructor.instructor_id = instructor_subject.instructor_id
          WHERE instructor_subject.subject_id = ?
        `;
        const teachersResult = await pool.query(teachersQuery, [
          subject.subject_id,
        ]);
        const teachers = teachersResult[0];

        // Populate details for each teacher
        for (const teacher of teachers) {
          // Add more details about the teacher if needed
        }
        const topicsQuery = "SELECT * FROM topics WHERE subject_id = ?";
        const topicsResult = await pool.query(topicsQuery, [
          subject.subject_id,
        ]);
        const topics = topicsResult[0];
        for (const topic of topics) {
        }
        subject.teachers = teachers;
        subject.topics = topics;
      }
      module.subjects = subjects;
    }
    course.modules = modules;

    res.status(200).json({ course });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

// ======================================  DELETE COURSE ======================================//

router.delete("/deleteCourse/:courseId", async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const checkCourseQuery = "SELECT * FROM courses WHERE course_id = ?";
    const [courseResult] = await pool.query(checkCourseQuery, [courseId]);

    if (courseResult.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const deleteTopicsQuery =
      "DELETE FROM topics WHERE subject_id IN (SELECT subject_id FROM subjects WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = ?))";
    await pool.query(deleteTopicsQuery, [courseId]);

    const deleteInstructorSubjectQuery =
      "DELETE FROM instructor_subject WHERE subject_id IN (SELECT subject_id FROM subjects WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = ?))";
    await pool.query(deleteInstructorSubjectQuery, [courseId]);
    const deleteModulesQuery = "DELETE FROM modules WHERE course_id = ?";
    await pool.query(deleteModulesQuery, [courseId]);

    const deleteSubjectsQuery =
      "DELETE FROM subjects WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = ?)";
    await pool.query(deleteSubjectsQuery, [courseId]);
    const deleteCourseQuery = "DELETE FROM courses WHERE course_id = ?";
    await pool.query(deleteCourseQuery, [courseId]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error during course deletion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
