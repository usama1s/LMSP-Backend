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
            const student_id = req.params.student_id;
            const quiz = await studentService.getQuiz(student_id);
            res.status(200).json(quiz);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}



// SELECT quiz_question.question,quiz_question.option_1,quiz_question.option_2,quiz_question.option_3,quiz_question.option_4,quiz_question.question_picture,quiz_question.answer FROM student_enrollment
// INNER JOIN program_plan on student_enrollment.program_plan_id=program_plan.program_plan_id
// INNER JOIN quiz on quiz.program_plan_id=program_plan.program_plan_id
// INNER JOIN quiz_question on quiz_question.quiz_question_id=quiz.quiz_id
// WHERE student_enrollment.student_id=1