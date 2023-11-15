const instructorService = require('../services/instructor.service')

module.exports = {

    // INSTRUCTOR ADD QUIZES
    async addQuiz(req, res) {
        const quizDetails = req.body;
        let i;
        for (i = 0; quizDetails.length; i++) {
            const question = quizDetails[i].question;
            const options = quizDetails[i].options;
            const correctOption = quizDetails[i].correctOption
            const quiz_image = quizDetails[i].image

            const base64File = quiz_image;
            const buffer = Buffer.from(base64File, 'base64');
            const defaultExtension = 'jpeg';

            const fileName = `quiz_image${Date.now()}.${defaultExtension}`;
            const quiz_image_path = path.join(__dirname, '../uploads', fileName);

            await fs.writeFile(quiz_image_path, buffer);


            const addQuiz = await instructorService.addQuiz(question, options, correctOption, quiz_image_path);
        }

    }
}