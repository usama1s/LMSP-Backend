// controllers/fileController.js
const generalServices = require("../services/general.service")
const path = require('path');
const fs = require('fs');


module.exports = {

    async getAllStudents(req, res) {
        try {
            const result = await generalServices.getAllStudents();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },



    serveFile: (req, res) => {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '..', 'uploads', filename);

            function base64_encode(file) {
                // read binary data
                const bitmap = fs.readFileSync(file);
                // convert binary data to base64 encoded string
                return Buffer.from(bitmap).toString('base64');
            }

            // Encode the file into base64
            const base64File = base64_encode(filePath);

            // Return the base64 encoded file in JSON
            res.json({ base64File });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}
















