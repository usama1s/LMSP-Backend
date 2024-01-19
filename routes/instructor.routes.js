const express = require("express");
const instructorController = require("../controllers/instructor.controller");
const sql = require("../services/sql.service");
const pool = require("../db.conn");
const router = express.Router();

// ROUTES

router.post("/add-quiz", instructorController.addQuiz);
router.post("/add-assignment", instructorController.addAssignment);
router.get(
  "/get-students-by-subject-id/:subject_id/:date",
  instructorController.getStudents
);
router.get(
  "/get-courses-by-instructor/:instructor_id",
  instructorController.getCoursesByInstructorId
);

router.post("/mark-attendence", instructorController.markAttendence);
router.post("/mark-assignment", instructorController.markAssignment);
router.post("/add-paper", instructorController.addPaper);
router.get(
  "/get-papers-by-subject-id/:subject_id",
  instructorController.getPaperBySubjectId
);

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

//get All Subjects
router.get("/subjects", async (req, res) => {
  try {
    const subjectsQuery = `
      SELECT 
        subjects.subject_id, 
        subjects.subject_name
      FROM subjects
    `;
    const subjectsResult = await pool.query(subjectsQuery);
    const subjects = subjectsResult[0];

    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error getting subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all students by course id
router.get("/students-by-courseId/:courseId", async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const studentsQuery = `
      SELECT 
        student.*,
        users.*,
        student_enrollment.*
      FROM student
      JOIN student_enrollment ON student.student_id = student_enrollment.student_id
      JOIN users ON student.user_id = users.id
      WHERE student_enrollment.course_id = ? AND student_enrollment.enrollment_status=1
    `;
    const studentsResult = await pool.query(studentsQuery, [courseId]);
    const students = studentsResult[0];

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error getting students of a course:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get papers by subject_id
router.get("/instructor-papers/:subject_id", async (req, res) => {
  const subject_id = req.params.subject_id;

  try {
    const papersQuery = `
      SELECT
        ip.id AS paper_id,
        ip.title AS paper_title,
        ip.paper_date,
        ip.subject_id,
        ip.section,
        ip.instructor_id,
        CONCAT(u.first_name, ' ', u.last_name) AS instructor_name,
        ipq.id AS question_id,
        ipq.title AS question_title,
        ipq.question,
        ipq.option_1,
        ipq.option_2,
        ipq.option_3,
        ipq.option_4,
        ipq.answer,
        ipq.question_picture,
        ipq.question_video
      FROM
        instructor_papers ip
      JOIN
        instructor_paper_questions ipq ON ip.id = ipq.instructor_paper_id
      JOIN
        instructor i ON ip.instructor_id = i.instructor_id
      JOIN
        users u ON i.user_id = u.id
      WHERE
        ip.subject_id = ?;
    `;

    const papersResult = await pool.query(papersQuery, [subject_id]);
    const papers = papersResult[0];

    // Organize the data into the desired structure
    const organizedData = papers.reduce((acc, paper) => {
      const existingPaper = acc.find((p) => p.paper_id === paper.paper_id);

      if (!existingPaper) {
        const newPaper = {
          paper_id: paper.paper_id,
          paper_title: paper.paper_title,
          paper_date: paper.paper_date,
          subject_id: paper.subject_id,
          section: paper.section,
          instructor_id: paper.instructor_id,
          instructor_name: paper.instructor_name,
          questions: [
            {
              question_id: paper.question_id,
              question_title: paper.question_title,
              question: paper.question,
              answer: paper.answer,
              question_picture: paper.question_picture,
              question_video: paper.question_video,
              options: [
                paper.option_1,
                paper.option_2,
                paper.option_3,
                paper.option_4,
              ],
            },
          ],
        };

        acc.push(newPaper);
      } else {
        existingPaper.questions.push({
          question_id: paper.question_id,
          question_title: paper.question_title,
          question: paper.question,
          answer: paper.answer,
          question_picture: paper.question_picture,
          question_video: paper.question_video,
          options: [
            paper.option_1,
            paper.option_2,
            paper.option_3,
            paper.option_4,
          ],
        });
      }

      return acc;
    }, []);

    res.status(200).json({ papers: organizedData });
  } catch (error) {
    console.error("Error getting papers of a subject:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-submitted-assignments/:instructorId/:subjectId", instructorController.getSubmittedAssignment);


module.exports = router;
