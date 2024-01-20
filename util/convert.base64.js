const fs = require('fs').promises;
const path = require('path');


module.exports = {

    // BASE 64 TO PDF
    async base64ToPdf(file) {
        const splitPdf = file.split(',')
        const base64File = splitPdf[1];
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'pdf';

        const fileName = `pdf_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fs.writeFile(filePath, buffer);
        return filePath;
    },

    // BASE 64 TO JPEG
    async base64ToJpg(file) {
        try {
            const splitJpg = file.split(',');
            const base64File = splitJpg[1]; // Take the second element after splitting
            const buffer = Buffer.from(base64File, 'base64');
            const defaultExtension = 'jpeg';

            const fileName = `jpg_file${Date.now()}.${defaultExtension}`;
            const filePath = path.join(__dirname, '../uploads', fileName);

            await fs.writeFile(filePath, buffer);
            return filePath;
        } catch (error) {
            console.error('Error converting base64 to jpg:', error);
            throw error; // Re-throw the error for proper error handling in the calling code
        }
    },

    // BASE 64 TO MP4
    async base64ToMp4(base64File) {
        // Split the base64 data URL
        const splitMp4 = base64File.split(',');

        // Extract the base64 data
        const base64Data = splitMp4[1];

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Set the file extension and create a unique filename
        const defaultExtension = 'mp4';
        const fileName = `mp4_file_${Date.now()}.${defaultExtension}`;

        // Set the file path
        const filePath = path.join(__dirname, '../uploads', fileName);

        // Write the buffer to the file
        await fs.writeFile(filePath, buffer);

        // Return the file path
        return filePath;
    }
}