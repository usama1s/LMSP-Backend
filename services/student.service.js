const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    // SUBMIT QUIZ 
    async submitQuiz(submittedQuizDetails) {
        const { student_id, quiz_id, total_marks, obtained_marks, grade } = submittedQuizDetails;
        await pool.query(sql.QUIZ_SUBMISSION, [student_id, quiz_id, total_marks, obtained_marks, grade]);
        return { message: 'Quiz submitted successfully.' };
    },


    // SUBMIT ASSIGNMENT
    async submitAssignment(student_id, assignment_id, submittedFilePath, marks, grade) {
        try {
            await pool.query(sql.ASSIGNMENT_SUBMISSION, [student_id, assignment_id, submittedFilePath, marks, grade]);
            return { message: 'Assignment submitted successfully.' };

        } catch (error) {
            console.log(error);
        }
    },

    // GET QUIZ
    async getQuiz(student_id) {
        try {
            const [quiz] = await pool.query(sql.GET_QUIZ, student_id);
            return { quiz };
        } catch (error) {
            console.log(error);
        }
    },
}