const instructorService = require("../services/instructor.service");
const convertBase64 = require("../util/convert.base64.js");
module.exports = {
  // INSTRUCTOR ADD QUIZES
  async addQuiz(req, res) {
    try {
      const quizDetails = req.body;
      const { program_plan_id, quiz_date, quiz_questions } = quizDetails;

      const quizId = await instructorService.addQuiz(
        program_plan_id,
        quiz_date
      );

      for (const {
        question,
        options,
        correctOption,
        image,
      } of quiz_questions) {
        const quizPath = await convertBase64.base64ToJpg(image);
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
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // INSTRUCTOR ADD ASSIGNMENT
  async addAssignment(req, res) {
    try {
      const assignmentDetails = req.body;

      const {
        program_plan_id,
        assignment_date,
        assignment_file,
        assignment_instruction,
        assignment_title,
      } = assignmentDetails;

      const assignmentPath = await convertBase64.base64ToPdf(assignment_file);

      await instructorService.addAssignment(
        program_plan_id,
        assignment_date,
        assignmentPath,
        assignment_instruction,
        assignment_title
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
      const { students, attendence_date } = attendenceDetails;
      const marked = await instructorService.markAttendence(
        students,
        attendence_date
      );
      return res.json(marked.message);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  async getStudents(req, res) {
    try {
      const { program_plan_id } = req.params;

      const students = await instructorService.getStudents(program_plan_id);

      return res.json(students);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
};
