const instructorService = require("../services/instructor.service");
const convertBase64 = require("../util/convert.base64.js");
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
};
