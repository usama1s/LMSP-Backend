const instructorService = require("../services/instructor.service");
const convertBase64 = require("../util/convert.base64.js");
const sql = require("../services/sql.service");
const pool = require("../db.conn");

module.exports = {
  // INSTRUCTOR ADD QUIZES
  async addQuiz(req, res) {
    try {
      const quizDetails = req.body;
      const { quiz_date, quiz_questions, instructor_id, subject_id, section } =
        quizDetails;

      const quizId = await instructorService.addQuiz(
        subject_id,
        instructor_id,
        quiz_date,
        section
      );

      for (const {
        question,
        options,
        correctOption,
        image,
      } of quiz_questions) {
        var quizPath = "";
        if (image) {
          quizPath = await convertBase64.base64ToJpg(image);
        }
        await instructorService.addQuizQuestion(
          quizId,
          question,
          options,
          quizPath,
          correctOption
        );
      }

      return res.json("Quiz added successfully");
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // INSTRUCTOR ADD ASSIGNMENT
  async addAssignment(req, res) {
    try {
      const assignmentDetails = req.body;

      const {
        // program_plan_id,
        assignment_date,
        assignment_file,
        assignment_instruction,
        assignment_title,
        subject_id,
        instructor_id,
        section,
      } = assignmentDetails;

      const assignmentPath = await convertBase64.base64ToPdf(assignment_file);

      await instructorService.addAssignment(
        // program_plan_id,
        assignment_date,
        assignmentPath,
        assignment_instruction,
        assignment_title,
        subject_id,
        instructor_id,
        section
      );

      return res.json("Assignment added successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // MARK ATTENDENCE OF STUDENT
  async markAttendence(req, res) {
    try {
      const attendenceDetails = req.body;
      const { students, attendence_date, subject_id, section } =
        attendenceDetails;
      const marked = await instructorService.markAttendence(
        students,
        attendence_date,
        subject_id,
        section
      );
      return res.json(marked.message);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async markAssignment(req, res) {
    try {
      const { assignments } = req.body;

      assignments.forEach(async (assignment) => {
        await pool.query(sql.MARK_ASSIGNMENT, [
          assignment.marks,
          assignment.grade,
          assignment.percentage,
          assignment.assignment_id,
          assignment.student_id,
        ]);
      });

      return res.json({ message: "Assignment marked successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // GET STUDENTS WITH PROGAM PLAN ID
  async getStudents(req, res) {
    try {
      const { subject_id, date } = req.params;

      const students = await instructorService.getStudents(subject_id, date);

      return res.json(students);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getCoursesByInstructorId(req, res) {
    try {
      const { instructor_id } = req.params;
      const courses = await instructorService.getCoursesByInstructorId(
        instructor_id
      );
      return res.json(courses);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
  //Add Paper
  async addPaper(req, res) {
    try {
      const paperDetails = req.body;
      const {
        paper_date,
        paper_questions,
        instructor_id,
        subject_id,
        section,
        title,
      } = paperDetails;

      const paperId = await instructorService.addPaper(
        subject_id,
        instructor_id,
        paper_date,
        section,
        title
      );

      for (const {
        question,
        options,
        correctOption,
        image,
        video,
      } of paper_questions) {
        var questionImagePath;
        var questionVideoPath;
        if (image) {
          questionImagePath = await convertBase64.base64ToJpg(image);
        }
        if (video) {
          questionVideoPath = await convertBase64.base64ToMp4(video);
        }
        await instructorService.addPaperQuestion(
          paperId,
          question,
          options,
          questionImagePath,
          questionVideoPath,
          correctOption,
          title
        );
      }

      return res.json("Paper added successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //get Papers by subject Id
  async getPaperBySubjectId(req, res) {
    try {
      const paperDetails = req.params;
      const { subject_id } = paperDetails;

      const papers = await instructorService.getPaperBySubjectId(subject_id);

      return res.json({ papers: papers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getInstructorPapersBySubject(req, res) {
    try {
      const { subject_id } = req.params;
      const papers = await instructorService.getInstructorPapersBySubject(
        subject_id
      );
      return res.json(papers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async editPaper(req, res) {
    try {
      const paperDetails = req.body;
      const {
        paper_id,
        paper_date,
        paper_questions,
        instructor_id,
        subject_id,
        section,
        title,
      } = paperDetails;

      // Step 1: Update Paper Details
      await instructorService.editPaper(
        paper_id,
        subject_id,
        instructor_id,
        paper_date,
        section,
        title
      );

      // Step 2: Update or Add Paper Questions
      for (const {
        question_id,
        question,
        options,
        correctOption,
        image,
        video,
      } of paper_questions) {
        const questionImagePath = await convertBase64.base64ToJpg(image);
        const questionVideoPath = await convertBase64.base64ToMp4(video);

        if (question_id) {
          // Update existing question
          await instructorService.editPaperQuestion(
            question_id,
            title,
            question,
            options,
            questionImagePath,
            questionVideoPath,
            correctOption
          );
        } else {
          // Add new question
          await instructorService.addPaperQuestion(
            paper_id,
            title,
            question,
            options,
            questionImagePath,
            questionVideoPath,
            correctOption
          );
        }
      }

      return res.json("Paper updated successfully");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // Delete Instructor Paper
  async deleteInstructorPaper(req, res) {
    try {
      const { paper_id } = req.params;
      await instructorService.deleteInstructorPaper(paper_id);
      return res.json({ message: "Instructor paper deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getSubmittedAssignment(req, res) {
    const instructorId = req.params.instructorId;
    const subjectId = req.params.subjectId;
    const allSubmittedAssignments = {
      subject_name: "",
      assignments: [],
    };
    try {
      if (subjectId != null) {
        const [submittedAssignment] = await pool.query(
          sql.GET_SUBMITTED_ASSIGNMENTS_BY_SUBJECT_ID,
          [instructorId, subjectId]
        );
        let currentSubject = null;
        const [studentdata] = await pool.query(sql.GET_USER_BY_STUDENT_ID, [
          submittedAssignment.student_id,
        ]);
        if (currentSubject !== submittedAssignment.subject_name) {
          currentSubject = submittedAssignment.subject_name;
          allSubmittedAssignments.subject_name = currentSubject;
        }

        const assignmentObject = {
          assignment_title: submittedAssignment.assignment_title, // Replace this with the actual assignment title
          submitted_by: [],
          assignment_id: submittedAssignment.assignment_id,
        };
        const submittedByObject = {
          student_id: submittedAssignment?.student_id,
          subject_id: submittedAssignment?.subject_id,
          student_name: studentdata[0]?.full_name,
          submitted_file: submittedAssignment?.assignment_file,
          grade: submittedAssignment?.grade,
          marks: submittedAssignment?.marks,

          date: submittedAssignment?.assignment_date,
          regId: submittedAssignment?.register_id,
        };
        assignmentObject.submitted_by.push(submittedByObject);
        allSubmittedAssignments.assignments.push(assignmentObject);

        res.status(200).json({ allSubmittedAssignments });
        return;
      }
      const [submittedAssignments] = await pool.query(
        sql.GET_SUBMITTED_ASSIGNMENTS,
        [instructorId]
      );
      let currentSubject = null;
      for (const submittedAssignment of submittedAssignments) {
        const [studentdata] = await pool.query(sql.GET_USER_BY_STUDENT_ID, [
          submittedAssignment.student_id,
        ]);
        if (currentSubject !== submittedAssignment.subject_name) {
          currentSubject = submittedAssignment.subject_name;
          allSubmittedAssignments.subject_name = currentSubject;
        }

        const assignmentObject = {
          assignment_title: submittedAssignment.assignment_title, // Replace this with the actual assignment title
          submitted_by: [],
          assignment_id: submittedAssignment.assignment_id,
        };
        const submittedByObject = {
          student_id: submittedAssignment.student_id,
          subject_id: submittedAssignment.subject_id,
          student_name: studentdata[0].full_name,
          submitted_file: submittedAssignment.assignment_file,
          grade: submittedAssignment.grade,
          date: submittedAssignment.assignment_date,
          regId: studentdata[0].register_id,
          marks: submittedAssignment?.marks,
        };
        assignmentObject.submitted_by.push(submittedByObject);
        allSubmittedAssignments.assignments.push(assignmentObject);
      }
      res.status(200).json({ allSubmittedAssignments });
    } catch (error) {
      console.error("Error during database retrieval:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
