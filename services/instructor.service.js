const sql = require('../services/sql.service')
const pool = require('../db.conn');


module.exports = {

    // INSTRUCTOR ADD QUIZES
    async addQuiz(req, res) {
        const quizDetails=req.body;
        if(quizDetails.quiz_question){

        }

    }
}