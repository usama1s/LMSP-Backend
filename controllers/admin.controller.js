const adminService = require('../services/admin.service');

module.exports = {

    // ADD ITEM WITH PICTURES
    async addItem(req, res) {
        try {
            const { admin_id, title, description, expiry, induction, make, model, failure_reason } = req.body;
            const informationFile = req.files['information_file'][0];
            const videoFile = req.files['video_file'][0];
            const imageFiles = [];

            for (let i = 1; i <= 10; i++) {
                const fieldName = `image_${i}`;
                if (req.files[fieldName] && req.files[fieldName][0]) {
                    imageFiles.push(req.files[fieldName][0].path);
                } else {
                    imageFiles.push(null);
                }
            }

            const result = await adminService.addItem({
                admin_id,
                title,
                description,
                expiry,
                induction,
                make,
                model,
                failure_reason,
                informationFilePath: informationFile.path,
                videoFilePath: videoFile.path,
                imageFilePaths: imageFiles,
            });

            return res.status(201).json({ message: result.message });
        } catch (error) {
            console.error('Error handling file uploads:', error);
            return res.status(500).json({ error: 'Failed to upload files and insert data' });
        }
    },

    //GET ALL ADDED ITEMS
    async getAllItems(req, res) {
        try {
            const result = await adminService.getAllItems();
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    //GET ITEM ID
    async getItemById(req, res) {
        try {
            const inventoryId = req.params.inventoryId
            const result = await adminService.getItemById(inventoryId);
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    },

    // ADD COURSE
    async addCourse(req, res) {
        try {
            const [courseDetails] = req.body
            const result = await adminService.addCourse(courseDetails);
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    }

}