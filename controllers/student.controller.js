const studentService = require('../services/student.service');
const convertBase64 = require('../util/convert.base64.js')

module.exports = {

    // SUBMIT QUIZ 
    async submitQuiz(req, res) {
        const submittedQuizDetails = req.body;
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
    }

}