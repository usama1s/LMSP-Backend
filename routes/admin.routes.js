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
// router.put("/editCourse", async (req, res) => {
//   const data = req.body;

//   try {
//     const outlineFilePath = await convertBase64.base64ToPdf(data.outline_file);
//     const courseQuery =
//       "UPDATE courses SET course_name = ?, course_description = ?, outline_file = ?, prerequisites = ?, learning_outcomes = ?, classroom_material = ?, reference_books = ? WHERE course_id = ?";
//     const courseValues = [
//       data.course_name,
//       data.course_description,
//       outlineFilePath,
//       data.prerequisites,
//       data.learning_outcomes,
//       data.classroom_material,
//       data.reference_books,
//       data.course_id,
//     ];
//     const courseResult = await pool.query(courseQuery, courseValues);

//     for (const module of data.modules) {
//       const moduleQuery =
//         "UPDATE modules SET module_name = ? WHERE module_id = ?";
//       const moduleValues = [module.module_name, module.module_id];

//       const moduleResult = await pool.query(moduleQuery, moduleValues);

//       for (const subject of module.subjects) {
//         const subjectQuery =
//           "UPDATE subjects SET subject_name = ? WHERE subject_id = ?";
//         const subjectValues = [subject.subject_name, subject.subject_id];

//         const subjectResult = await pool.query(subjectQuery, subjectValues);

//         for (const teacher of subject.teachers) {
//           const teacherId = teacher.teacherID || teacher.instructor_id;

//           const teacherSubjectQuery =
//             "UPDATE instructor_subject SET section = ? WHERE instructor_id = ? AND subject_id = ?";
//           const teacherSubjectValues = [
//             teacher.section,
//             teacherId,
//             subject.subject_id,
//           ];

//           await pool.query(teacherSubjectQuery, teacherSubjectValues);
//         }

//         for (const topic of subject.topics) {
//           const topicQuery =
//             "UPDATE topics SET topic_name = ?, lecture_file_name = ?, lecture_file_type = ?, lecture_file = ? WHERE topic_id = ?";
//           const topicValues = [
//             topic.topic_name,
//             topic.lecture_file_name,
//             topic.lecture_file_type,
//             topic.lecture_file,
//             topic.topic_id,
//           ];

//           await pool.query(topicQuery, topicValues);
//         }
//       }
//     }

//     res.status(200).json({ message: "Data updated successfully" });
//   } catch (error) {
//     console.error("Error during database insertion:", error);
//     res.status(200).json({ error: "Internal Server Error" });
//   }
// });

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
      if (module.module_id) {
        // Update existing module
        const updateModuleQuery =
          "UPDATE modules SET module_name = ? WHERE module_id = ?";
        const updateModuleValues = [module.module_name, module.module_id];
        await pool.query(updateModuleQuery, updateModuleValues);
      } else {
        // Insert new module
        const insertModuleQuery =
          "INSERT INTO modules (course_id, module_name) VALUES (?, ?)";
        const insertModuleValues = [data.course_id, module.module_name];
        const moduleResult = await pool.query(
          insertModuleQuery,
          insertModuleValues
        );
        module.module_id = moduleResult[0].insertId;
      }

      for (const subject of module.subjects) {
        if (subject.subject_id) {
          // Update existing subject
          const updateSubjectQuery =
            "UPDATE subjects SET subject_name = ? WHERE subject_id = ?";
          const updateSubjectValues = [
            subject.subject_name,
            subject.subject_id,
          ];
          await pool.query(updateSubjectQuery, updateSubjectValues);
        } else {
          // Insert new subject
          const insertSubjectQuery =
            "INSERT INTO subjects (module_id, subject_name) VALUES (?, ?)";
          const insertSubjectValues = [module.module_id, subject.subject_name];
          const subjectResult = await pool.query(
            insertSubjectQuery,
            insertSubjectValues
          );
          subject.subject_id = subjectResult[0].insertId;
        }

        for (const teacher of subject.teachers) {
          const teacherId = teacher.teacherID || teacher.instructor_id;

          // Check if instructor_subject record exists
          const checkTeacherSubjectQuery =
            "SELECT * FROM instructor_subject WHERE instructor_id = ? AND subject_id = ?";
          const checkTeacherSubjectValues = [teacherId, subject.subject_id];
          const checkTeacherSubjectResult = await pool.query(
            checkTeacherSubjectQuery,
            checkTeacherSubjectValues
          );

          if (checkTeacherSubjectResult[0].length > 0) {
            // Update existing instructor_subject record
            const updateTeacherSubjectQuery =
              "UPDATE instructor_subject SET section = ? WHERE instructor_id = ? AND subject_id = ?";
            const updateTeacherSubjectValues = [
              teacher.section,
              teacherId,
              subject.subject_id,
            ];
            await pool.query(
              updateTeacherSubjectQuery,
              updateTeacherSubjectValues
            );
          } else {
            // Insert new instructor_subject record
            const insertTeacherSubjectQuery =
              "INSERT INTO instructor_subject (instructor_id, subject_id, section) VALUES (?, ?, ?)";
            const insertTeacherSubjectValues = [
              teacherId,
              subject.subject_id,
              teacher.section,
            ];
            await pool.query(
              insertTeacherSubjectQuery,
              insertTeacherSubjectValues
            );
          }
        }

        for (const topic of subject.topics) {
          if (topic.topic_id) {
            // Update existing topic
            const updateTopicQuery =
              "UPDATE topics SET topic_name = ?, lecture_file_name = ?, lecture_file_type = ?, lecture_file = ? WHERE topic_id = ?";
            const updateTopicValues = [
              topic.topic_name,
              topic.lecture_file_name,
              topic.lecture_file_type,
              topic.lecture_file,
              topic.topic_id,
            ];
            await pool.query(updateTopicQuery, updateTopicValues);
          } else {
            // Insert new topic
            const insertTopicQuery =
              "INSERT INTO topics (subject_id, topic_name, lecture_file_name, lecture_file_type, lecture_file) VALUES (?, ?, ?, ?, ?)";
            const insertTopicValues = [
              subject.subject_id,
              topic.topic_name,
              topic.lecture_file_name,
              topic.lecture_file_type,
              topic.lecture_file,
            ];
            await pool.query(insertTopicQuery, insertTopicValues);
          }
        }
      }
    }

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error during database update:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  const quizesObj = [];
  const assignmentsObj = [];

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
        const [studentAttendance] = await pool.query(
          sql.GET_ATTENDENCE_SUBJECT_AND_STUDENT_ID,
          [studentId, subject.subject_id]
        );
        for (const attendance of studentAttendance) {
          subjectsWithAttendance.push(attendance);
        }
        const [quizes] = await pool.query(sql.GET_QUIZ_BY_SUBJECT_ID, [
          subject.subject_id,
        ]);
        if (quizes.length > 0) {
          for (const quiz of quizes) {
            const [quiz_submitted] = await pool.query(sql.GET_QUIZ_SUBMITTED, [
              quiz.quiz_id,
              studentId,
            ]);
            if (quiz_submitted.length == 0) {
              quizesObj.push(quiz);
            }
          }
        }
        const [assignments] = await pool.query(
          sql.GET_ASSIGNMENT_BY_SUBJECT_ID,
          [subject.subject_id]
        );
        if (assignments.length > 0) {
          for (const assignment of assignments) {
            const [assigment_submitted] = await pool.query(
              sql.GET_ASSIGNMENT_SUBMITTED,
              [assignment.assignment_id, studentId]
            );
            if (assigment_submitted.length == 0) {
              assignmentsObj.push(assignment);
            }
          }
        }

        const [papers] = await pool.query(sql.GET_FINAL_PAPERS_BY_SUBJECT_ID, [
          subject.subject_id,
        ]);
        if (papers.length > 0) {
          for (const paper of papers) {
            const [paper_submitted] = await pool.query(
              sql.GET_PAPER_SUBMITTED,
              [paper.id, studentId]
            );
            if (paper_submitted.length == 0) {
              finalPapers.push(paper);
            }
          }
        }
        subject.teachers = teachers;
        subject.topics = topics;
      }
      module.subjects = subjects;
    }
    course.modules = modules;

    // modifying Quiz structure
    const modifiedQuiz = {
      quizes: {
        ...quizesObj.reduce((acc, quiz) => {
          const quizId = quiz.quiz_id;
          acc[quizId] = acc[quizId] || [];
          acc[quizId].push(quiz);
          return acc;
        }, {}),
      },
    };

    const modifiedPaper = {
      papers: Object.values(
        finalPapers.reduce((acc, paper) => {
          const paperSubject = paper.subject_id;
          acc[paperSubject] = acc[paperSubject] || { subject_id: paperSubject, questions: [] };
          acc[paperSubject].questions.push(paper);
          return acc;
        }, {})
      ),
    };

    res.status(200).json({
      course,
      subjectsWithAttendance,
      modifiedPaper,
      modifiedQuiz,
      assignmentsObj,
    });
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
    var allCertificates = [];

    await Promise.all(
      certificates.map(async (item) => {
        var getCourseName = "Select course_name from courses where course_id=?";
        var getCourseNameResult = await pool.query(getCourseName, [
          item.course_id,
        ]);
        var getUserName = "Select first_name,last_name from users where id=?";
        var getUserNameResult = await pool.query(getUserName, [item.user_id]);
        var getIssuedByName = "Select user_id from admin where admin_id=?";
        var getIssuedByNameResult = await pool.query(getIssuedByName, [
          item.issued_by,
        ]);
        var getIssuedBy = "Select first_name,last_name from users where id=?";
        var getIssuedByResult = await pool.query(getIssuedBy, [
          getIssuedByNameResult[0][0].user_id,
        ]);

        allCertificates.push({
          ...item,
          course_name: getCourseNameResult[0][0].course_name,
          user_name:
            getUserNameResult[0][0].first_name +
            " " +
            getUserNameResult[0][0].last_name,
          issued_by_name:
            getIssuedByResult[0][0].first_name +
            " " +
            getIssuedByResult[0][0].last_name,
        });
      })
    );

    res.status(200).json({ allCertificates });
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
router.get(
  "/get-stats-by-subjects/:studentId/:subjectId",
  adminController.getAllStatsBySubjects
);

router.get(
  "/get-stats-by-subjects/:courseId",
  adminController.getAllStudentStatsByCourse
);
