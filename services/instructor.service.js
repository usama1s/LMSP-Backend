const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    // INSTRUCTOR ADD QUIZES
    async addQuiz(program_plan_id, quiz_date) {
        try {
            const [addQuiz] = await pool.query(sql.ADD_QUIZ, [program_plan_id, quiz_date]);
            return addQuiz.insertId;
        }
        catch (error) {
            throw error('error inserting quiz')
        }
    },

    // ADD QUESTION WITH QUIZ ID
    async addQuizQuestion(quizId, question, options, quiz_image_path, correctOption) {
        const option1 = options[0];
        const option2 = options[1];
        const option3 = options[2];
        const option4 = options[3];
        await pool.query(sql.ADD_QUIZ_QUESTION, [quizId, question, option1, option2, option3, option4, quiz_image_path, correctOption]);
    }
}