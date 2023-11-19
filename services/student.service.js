const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    // SUBMIT QUIZ 
    async submitQuiz(req, res) {
        const submittedQuizDetails = req.body;
    },

    // SUBMIT ASSIGNMENT
    async submitAssignment(student_id, assignment_id, submittedFilePath, marks, grade) {
        try {
            await pool.query(sql.ASSIGNMENT_SUBMISSION, [student_id, assignment_id, submittedFilePath, marks, grade]);
            return { message: 'Assignment submitted successfully.' };

        } catch (error) {
            console.log(error);
        }
    }

}