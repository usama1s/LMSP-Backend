const studentService = require('../services/student.service');
const convertBase64 = require('../util/convert.base64.js')

module.exports = {

    // SUBMIT QUIZ 
    async submitQuiz(req, res) {
        try {
            const submittedQuizDetails = req.body;
            const quizSubmitted = await studentService.submitQuiz(submittedQuizDetails);
            res.status(200).json(quizSubmitted.message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // SUBMIT ASSIGNMENT
    async submitAssignment(req, res) {
        try {
            const submittedAssignmentDetails = req.body;
            const { student_id, assignment_id, submitted_file, marks, grade } = submittedAssignmentDetails;
            const submittedFilePath = await convertBase64.base64ToPdf(submitted_file);
            const assignmentSubmitted = await studentService.submitAssignment(student_id, assignment_id, submittedFilePath, marks, grade);
            res.status(200).json(assignmentSubmitted.message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // GET QUIZ
    async getQuiz(req, res) {
        try {
            const quizDate = req.params.date;
            const quiz = await studentService.getQuiz(quizDate);
            res.status(200).json(quiz);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}