const adminService = require("../services/admin.service");

module.exports = {
  //GET ALL USERS
  async getAllUsers(req, res) {
    try {
      const result = await adminService.getAllUsers();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ADD ITEM WITH PICTURES
  async addItem(req, res) {
    try {
      const inventoryItemDetail = req.body;
      const result = await adminService.addItem(inventoryItemDetail);
      return res.status(201).json({ message: result.message });
    } catch (error) {
      console.error("Error handling file uploads:", error);
      return res
        .status(500)
        .json({ error: "Failed to upload files and insert data" });
    }
  },

  //GET ALL ADDED ITEMS
  async getAllItems(req, res) {
    try {
      const result = await adminService.getAllItems();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //GET ITEM ID
  async getItemById(req, res) {
    try {
      const inventoryId = req.params.inventoryId;
      const result = await adminService.getItemById(inventoryId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ADD COURSE
  async addCourseFullDetails(req, res) {
    try {
      const courseDetails = req.body;
      const { course_name, course_description, modules } = courseDetails;
      const result = await adminService.addCourseFullDetails(
        course_name,
        course_description,
        modules
      );
      res.status(200).json(result.message);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ADD PROGRAM
  async addProgram(req, res) {
    try {
      const programDetails = req.body;
      const result = await adminService.addProgram(programDetails);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ADD PROGRAM PLAN
  async addProgramPlan(req, res) {
    try {
      const programPlanDetails = req.body;
      const result = await adminService.addProgramPlan(programPlanDetails);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // GET PROGRAM PLAN
  async getAllProgramPlan(req, res) {
    try {
      const result = await adminService.getAllProgramPlan();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ADD CLASS
  async addClass(req, res) {
    try {
      const classDetails = req.body;
      const result = await adminService.addClass(classDetails);
      return res.status(200).json(result.message);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // GET ALL COURSES
  async getAllCourses(req, res) {
    try {
      const result = await adminService.getAllCourses();
      if (result.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // GET ALL INSTRUCTORS
  async getAllInstructor(req, res) {
    try {
      const instructors = await adminService.getAllInstructor();
      return res.status(200).json({ instructors });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // ENROLL STUDENT
  async enrollStudent(req, res) {
    try {
      console.log("I am ind");
      const enrollmentDetails = req.body;
      const result = await adminService.enrollStudent(enrollmentDetails);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //GET ALL ENROLLED STUDENTS
  async getAllStudentsWithEnrollment(req, res) {
    try {
      const result = await adminService.getAllStudentsWithEnrollment();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // UPDATE ENROLLED STUDENT

  async updateStudentStatus(req, res) {
    const { status, student_enrollment_id } = req.body;
    console.log(status, student_enrollment_id);
    try {
      const result = await adminService.updateStudentStatus(
        status,
        student_enrollment_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async deleteStudentEnrollment(req, res) {
    const { student_enrollment_id } = req.body;

    try {
      const result = await adminService.deleteEnrollmentById(
        student_enrollment_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //GET ALL ADMINS
  async getAllAdmins(req, res) {
    try {
      const admins = await adminService.getAllAdmins();
      return res.status(200).json({ admins });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // GET WHOLE PROGRAM
  async getWholeProgram(req, res) {
    try {
      const result = await adminService.getWholeProgram();
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //ADd paper by instructor
  async addPaper(req, res) {
    try {
      const paperDetails = req.body;
      const {
        paper_date,
        paper_questions,
        admin_id,
        subject_id,

        title,
      } = paperDetails;

      const paperId = await adminService.addPaper(
        subject_id,
        admin_id,
        paper_date,

        title
      );

      for (const { question_id } of paper_questions) {
        await adminService.addPaperQuestion(paperId, question_id);
      }

      return res.json("Paper added successfully");
    } catch (error) {
      console.log(error);
      return res.status(200).json({ error: "An error occurred" });
    }
  },

  //GET PAPER BY PAPER ID
  async getPaperByPaperId(req, res) {
    try {
      const { id } = req.params;
      const paper = await adminService.getPaperByPaperId(id);
      return res.json(paper);
    } catch (error) {
      console.log(error);
      return res.status(200).json({ error: "An error occurred" });
    }
  },

  async deleteAdminPaper(req, res) {
    try {
      const { paper_id } = req.params;
      await adminService.deleteAdminPaper(paper_id);
      return res.json({ message: "Admin paper deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getAllStats(req, res) {
    try {
      const { studentId } = req.params;
      const stats = await adminService.getAllStats(studentId);
      return res.json(stats);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getAllStatsBySubjects(req, res) {
    try {
      const { studentId, subjectId } = req.params;
      const statsPerSubject = await adminService.getAllStatsBySubjects(studentId, subjectId);
      return res.json(statsPerSubject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
};
