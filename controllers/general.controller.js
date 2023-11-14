// controllers/fileController.js
const path = require('path');
const fs = require('fs');

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
    },

    // download:(req,res)=>{
    //     try {
    //         const { filename } = req.params;
    //         const filePath = path.join(__dirname, '..', 'uploads', filename);
        
    //         // Set the appropriate headers for the response
    //         res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    //         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    //         const fileStream = fs.createReadStream(filePath);
    //         fileStream.pipe(res);
    //       } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //       }
    // }
}


















// module.exports = {
//     serveFile: (req, res) => {
//       try {
//         const { filename } = req.params;
//         const filePath = path.join(__dirname, '..', 'uploads', filename);
  
//         // Read the file as binary data
//         const fileBuffer = fs.readFileSync(filePath);
  
//         // Convert the binary data to base64
//         const base64String = fileBuffer.toString('base64');
  
//         // Send the base64-encoded string as a response
//         res.status(200).json({ base64Data: base64String });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
//   };