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

router.post(
  "/delete-student-enrollment",
  adminController.deleteStudentEnrollment
);

router.post("/addPaper", adminController.addPaper);
router.post("/getPaper/:id", adminController.getPaperByPaperId);

router.post("/deletePaper/:id", adminController.deleteAdminPaper);

//add course
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
          const teacherId = teacher.teacherID || teacher.instructor_id;

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

//edit course
router.put("/editCourse", async (req, res) => {
  const data = req.body;

  try {
    const outlineFilePath = await convertBase64.base64ToPdf(data.outline_file);
    const courseQuery =
      "UPDATE courses SET course_name = ?, course_description = ?, outline_file = ?, prerequisites = ?, learning_outcomes = ?, classroom_material = ?, reference_books = ? WHERE course_id = ?";
    const courseValues = [
      data.course_name,
      data.course_description,
      outlineFilePath,
      data.prerequisites,
      data.learning_outcomes,
      data.classroom_material,
      data.reference_books,
      data.course_id,
    ];
    const courseResult = await pool.query(courseQuery, courseValues);

    for (const module of data.modules) {
      const moduleQuery =
        "UPDATE modules SET module_name = ? WHERE module_id = ?";
      const moduleValues = [module.module_name, module.module_id];

      const moduleResult = await pool.query(moduleQuery, moduleValues);

      for (const subject of module.subjects) {
        const subjectQuery =
          "UPDATE subjects SET subject_name = ? WHERE subject_id = ?";
        const subjectValues = [subject.subject_name, subject.subject_id];

        const subjectResult = await pool.query(subjectQuery, subjectValues);

        for (const teacher of subject.teachers) {
          const teacherId = teacher.teacherID || teacher.instructor_id;

          const teacherSubjectQuery =
            "UPDATE instructor_subject SET section = ? WHERE instructor_id = ? AND subject_id = ?";
          const teacherSubjectValues = [
            teacher.section,
            teacherId,
            subject.subject_id,
          ];

          await pool.query(teacherSubjectQuery, teacherSubjectValues);
        }

        for (const topic of subject.topics) {
          const topicQuery =
            "UPDATE topics SET topic_name = ?, lecture_file_name = ?, lecture_file_type = ?, lecture_file = ? WHERE topic_id = ?";
          const topicValues = [
            topic.topic_name,
            topic.lecture_file_name,
            topic.lecture_file_type,
            topic.lecture_file,
            topic.topic_id,
          ];

          await pool.query(topicQuery, topicValues);
        }
      }
    }

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error during database insertion:", error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

// get all courses with modules,subjects, instructor, instructor
router.get("/getCourses", async (req, res) => {
  try {
    // Get coursess
    const coursesQuery = "SELECT * FROM courses";
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult[0];

    // Get modules for each course
    for (const course of courses) {
      const modulesQuery = "SELECT * FROM modules WHERE course_id = ?";
      const modulesResult = await pool.query(modulesQuery, [course.course_id]);
      const modules = modulesResult[0];

      // Get subjects for each module
      for (const module of modules) {
        const subjectsQuery = "SELECT * FROM subjects WHERE module_id = ?";
        const subjectsResult = await pool.query(subjectsQuery, [
          module.module_id,
        ]);
        const subjects = subjectsResult[0];

        // Get teachers for each subject
        for (const subject of subjects) {
          const teachersQuery = `
            SELECT instructor.*, instructor_subject.section,users.first_name,users.last_name,users.email
            FROM instructor
            JOIN users ON instructor.user_id = users.id
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
    }

    res.status(200).json({ courses });
  } catch (err) {
    console.log(err);
  }
});

// -------------------------------------      GET COURSE BY ID ---------------------------------- //

router.get("/getCourse/:courseId/:studentId", async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  const subjectsWithAttendance = [];
  const finalPapers = [];
  const QzAzAgainstSubjects = [];
  const quizes = {};
  const assignments = {};

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
      subjects = subjectsResult[0];

      for (const subject of subjects) {
        const teachersQuery = `
          SELECT instructor.*, instructor_subject.section,users.first_name,users.last_name,users.email
            FROM instructor
            JOIN users ON instructor.user_id = users.id
            JOIN instructor_subject ON instructor.instructor_id = instructor_subject.instructor_id
            WHERE instructor_subject.subject_id = ?
        `;
        const teachersResult = await pool.query(teachersQuery, [
          subject.subject_id,
        ]);
        const teachers = teachersResult[0];
        // Populate details for each teachers
        for (const teacher of teachers) {
          // Add more details about the teacher if needed
        }
        const topicsQuery = "SELECT * FROM topics WHERE subject_id = ?";
        const topicsResult = await pool.query(topicsQuery, [
          subject.subject_id,
        ]);
        const topics = topicsResult[0];
        const [studentAttendance] = await pool.query(sql.GET_ATTENDENCE_SUBJECT_AND_STUDENT_ID, [studentId, subject.subject_id,]);
        for (const attendance of studentAttendance) {
          subjectsWithAttendance.push(attendance);
        }

        const [paper] = await pool.query(sql.GET_FINAL_PAPERS, [subject.subject_id,]);
        const [quiz] = await pool.query(sql.GET_QUIZ_BY_SUBJECT_ID, [subject.subject_id,]);
        const [assignment] = await pool.query(sql.GET_ASSIGNMENT_BY_SUBJECT_ID, [subject.subject_id,]);
        if (quiz[0]?.subjectId === assignment[0]?.subjectId) {
          QzAzAgainstSubjects.push(subject.subject_name, { quiz: quiz[0], assignment: assignment[0] });
        }

        subject.teachers = teachers;
        subject.topics = topics;
        pushIfNotNullOrUndefined(paper[0], finalPapers);
        // pushIfNotNullOrUndefined(quiz[0], quizes);
        // pushIfNotNullOrUndefined(assignment[0], assignments);
        function pushIfNotNullOrUndefined(value, array) {
          if (value !== null && value !== undefined) {
            array.push(value);
          }
        }
      }
      module.subjects = subjects;
    }
    course.modules = modules;

    res.status(200).json({ course, subjectsWithAttendance, finalPapers, QzAzAgainstSubjects });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;

// ======================================  GET ALL COURSES ======================================//

router.get("/getAllCourses", async (req, res) => {
  try {
    const coursesQuery = "SELECT * FROM courses";
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult[0];

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET ALL COURSES NAMES WITH IDS ====================================//

router.get("/getAllCoursesNamesWithIds", async (req, res) => {
  try {
    const coursesQuery = "SELECT course_id, course_name FROM courses";
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult[0];

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

    const deleteSubjectsQuery =
      "DELETE FROM subjects WHERE module_id IN (SELECT module_id FROM modules WHERE course_id = ?)";
    await pool.query(deleteSubjectsQuery, [courseId]);
    const deleteModulesQuery = "DELETE FROM modules WHERE course_id = ?";
    await pool.query(deleteModulesQuery, [courseId]);
    const deleteCourseQuery = "DELETE FROM courses WHERE course_id = ?";
    await pool.query(deleteCourseQuery, [courseId]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error during course deletion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  ADD FAQ ======================================//
router.post("/addFaq", async (req, res) => {
  const data = req.body;

  try {
    const faqQuery = "INSERT INTO faqs (question,answer) VALUES (?, ?)";
    const faqValues = [data.question, data.answer];
    const faqesult = await pool.query(faqQuery, faqValues);

    res.status(200).json({ message: "Faq added successfully" });
  } catch (error) {
    console.error("Error during database insertion:", error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET FAQ ======================================//
router.get("/getFaq", async (req, res) => {
  try {
    const faqQuery = "SELECT * FROM faqs";
    const faqResult = await pool.query(faqQuery);
    const faqs = faqResult[0];
    res.status(200).json({ faqs });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  DELETE FAQ ======================================//
router.delete("/deleteFaq/:faqId", async (req, res) => {
  const faqId = req.params.faqId;

  try {
    const checkFaqQuery = "SELECT * FROM faqs WHERE id = ?";
    const [faqResult] = await pool.query(checkFaqQuery, [faqId]);

    if (faqResult.length === 0) {
      return res.status(404).json({ error: "Faq not found" });
    }

    const deleteFaqQuery = "DELETE FROM faqs WHERE id = ?";
    await pool.query(deleteFaqQuery, [faqId]);

    res.status(200).json({ message: "Faq deleted successfully" });
  } catch (error) {
    console.error("Error during faq deletion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  EDIT FAQ ======================================//
router.put("/editFaq/:faqId", async (req, res) => {
  const faqId = req.params.faqId;
  const data = req.body;

  try {
    const checkFaqQuery = "SELECT * FROM faqs WHERE id = ?";
    const [faqResult] = await pool.query(checkFaqQuery, [faqId]);

    if (faqResult.length === 0) {
      return res.status(404).json({ error: "Faq not found" });
    }

    const editFaqQuery =
      "UPDATE faqs SET question = ?, answer = ? WHERE id = ?";
    const editFaqValues = [data.question, data.answer, faqId];
    await pool.query(editFaqQuery, editFaqValues);

    res.status(200).json({ message: "Faq updated successfully" });
  } catch (error) {
    console.error("Error during faq updation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  ADD CONTACT US ======================================//

router.post("/addContactUs", async (req, res) => {
  const data = req.body;

  try {
    const contactUsQuery =
      "INSERT INTO contact_us (name, email, subject, message) VALUES (?, ?, ?, ?)";
    const contactUsValues = [data.name, data.email, data.subject, data.message];
    const contactUsresult = await pool.query(contactUsQuery, contactUsValues);

    res
      .status(200)
      .json({ message: "Your message has been sent successfully" });
  } catch (error) {
    console.error("Error during database insertion:", error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET CONTACT US ======================================//
router.get("/getContactUs", async (req, res) => {
  try {
    const contactUsQuery = "SELECT * FROM contact_us";
    const contactUsResult = await pool.query(contactUsQuery);
    const contactUs = contactUsResult[0];

    res.status(200).json({ contactUs });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  GENERATE CERTIFICATE ======================================//
// INSERT INTO `Certificates`(`certificate_id`, `course_id`, `student_id`, `issued_by`, `date`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]')
router.post("/generateCertificate", async (req, res) => {
  const data = req.body;

  try {
    const certificateQuery =
      "INSERT INTO Certificates (course_id, user_id, issued_by, date,title) VALUES (?, ?, ?, ?,?)";
    const certificateValues = [
      data.course_id,
      data.student_id,
      data.issued_by,
      data.date,
      data.title,
    ];
    const certificateResult = await pool.query(
      certificateQuery,
      certificateValues
    );

    res.status(200).json({ message: "Certificate generated successfully" });
  } catch (error) {
    console.error("Error during database insertion:", error);
    res.status(200).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET ALL CERTIFICATES ======================================//
router.get("/getAllCertificates", async (req, res) => {
  try {
    const certificateQuery = "SELECT * FROM Certificates";
    const certificateResult = await pool.query(certificateQuery);
    const certificates = certificateResult[0];

    res.status(200).json({ certificates });
  } catch (error) {
    console.error("Error during database retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  DELETE CERTIFICATE ======================================//
router.delete("/deleteCertificate/:certificateId", async (req, res) => {
  const certificateId = req.params.certificateId;

  try {
    const checkCertificateQuery =
      "SELECT * FROM Certificates WHERE certificate_id = ?";
    const [certificateResult] = await pool.query(checkCertificateQuery, [
      certificateId,
    ]);

    if (certificateResult.length === 0) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const deleteCertificateQuery =
      "DELETE FROM Certificates WHERE certificate_id = ?";
    await pool.query(deleteCertificateQuery, [certificateId]);

    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error during certificate deletion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  EDIT CERTIFICATE ======================================//
router.put("/editCertificate/:certificateId", async (req, res) => {
  const certificateId = req.params.certificateId;
  const data = req.body;

  try {
    const checkCertificateQuery =
      "SELECT * FROM Certificates WHERE certificate_id = ?";
    const [certificateResult] = await pool.query(checkCertificateQuery, [
      certificateId,
    ]);

    if (certificateResult.length === 0) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const editCertificateQuery =
      "UPDATE Certificates SET course_id = ?, student_id = ?, issued_by = ?, date = ? WHERE certificate_id = ?";
    const editCertificateValues = [
      data.course_id,
      data.student_id,
      data.issued_by,
      data.date,
      certificateId,
    ];
    await pool.query(editCertificateQuery, editCertificateValues);

    res.status(200).json({ message: "Certificate updated successfully" });
  } catch (error) {
    console.error("Error during certificate updation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET CERTIFICATE BY ID ======================================//
router.get("/getCertificateById/:certificateId", async (req, res) => {
  const certificateId = req.params.certificateId;

  try {
    const certificateQuery =
      "SELECT * FROM Certificates WHERE certificate_id = ?";
    const [certificateResult] = await pool.query(certificateQuery, [
      certificateId,
    ]);

    if (certificateResult.length === 0) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificate = certificateResult[0];

    res.status(200).json({ certificate });
  } catch (error) {
    console.error("Error during certificate retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ======================================  GET CERTIFICATE BY STUDENT ID ===============================//
router.get("/getCertificateByStudentId/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // get student details as well with certificate details
    const certificateQuery = "SELECT * FROM Certificates WHERE student_id = ?";
    const [certificateResult] = await pool.query(certificateQuery, [studentId]);

    if (certificateResult.length === 0) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificates = certificateResult[0];

    res.status(200).json({ certificates });
  } catch (error) {
    console.error("Error during certificate retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/get-stats/:studentId", adminController.getAllStats);
router.get("/get-stats-by-subjects/:studentId/:subjectId", adminController.getAllStatsBySubjects);

