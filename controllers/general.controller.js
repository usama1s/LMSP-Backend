// controllers/fileController.js
const path = require('path');


module.exports = {
    serveFile: (req, res) => {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '..', 'uploads', filename);

            // Send the file
            res.sendFile(filePath);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
