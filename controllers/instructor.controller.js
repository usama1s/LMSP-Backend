const instructorService = require('../services/instructor.service')
const fs = require('fs').promises;
const path = require('path');
module.exports = {

    // INSTRUCTOR ADD QUIZES
    async addQuiz(req, res) {
        try {
            const quizDetails = req.body;
            const { program_plan_id, quiz_date, quiz_questions } = quizDetails;

            const quizId = await instructorService.addQuiz(program_plan_id, quiz_date);

            for (const { question, options, correctOption, image } of quiz_questions) {
                const base64File = image;
                const buffer = Buffer.from(base64File, 'base64');
                const defaultExtension = 'jpeg';

                const fileName = `quiz_image${Date.now()}.${defaultExtension}`;
                const quizImagePath = path.join(__dirname, '../uploads', fileName);

                await fs.writeFile(quizImagePath, buffer);
                await instructorService.addQuizQuestion(quizId, question, options, quizImagePath, correctOption);
            }

            return res.json({ message: 'Quiz added successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // INSTRUCTOR ADD ASSIGNMENT
    async addAssignment(req, res) {
        try {
            const quizDetails = req.body;
            const { program_plan_id, quiz_date, quiz_questions } = quizDetails;

            const quizId = await instructorService.addAssignment(program_plan_id, quiz_date);

            for (const { question, options, correctOption, image } of quiz_questions) {
                const base64File = image;
                const buffer = Buffer.from(base64File, 'base64');
                const defaultExtension = 'jpeg';

                const fileName = `quiz_image${Date.now()}.${defaultExtension}`;
                const quizImagePath = path.join(__dirname, '../uploads', fileName);

                await fs.writeFile(quizImagePath, buffer);
                await instructorService.addAssignment(quizId, question, options, quizImagePath, correctOption);
            }

            return res.json({ message: 'Quiz added successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }
    }
}