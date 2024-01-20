// controllers/fileController.js
const generalServices = require("../services/general.service");
const path = require("path");
const fs = require("fs");

module.exports = {
  //GET ALL STUDENTS
  async getAllStudents(req, res) {
    try {
      const result = await generalServices.getAllStudents();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //GET ALL STUDENTS WITH PROGRAM THEY ARE ENROLLED IN
  async getAllStudentsWithPrograms(req, res) {
    try {
      const result = await generalServices.getAllStudentsWithPrograms();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  //GET ALL STUDENTS WITH PROGRAM THEY ARE ENROLLED IN
  async changePassword(req, res) {
    try {
      const { current_password, new_password, user_id } = req.body;

      const result = await generalServices.changePassword(
        current_password,
        new_password,
        user_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },

  // FETCH DATA FROM FOLDER AND RETURN BASE 64
  serveFile: (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "..", "uploads", filename);

      function base64_encode(file) {
        // read binary data
        const bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return bitmap.toString("base64");
      }

      // Encode the file into base64
      const base64File = base64_encode(filePath);

      // Return the base64 encoded file in JSON
      res.json({ base64File });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
