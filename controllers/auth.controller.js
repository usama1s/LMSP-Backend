const authService = require("../services/auth.service");
const convertBase64 = require("../util/convert.base64.js");
const mime = require("mime");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  // REGISTER
  async register(req, res) {
    try {
      const userDetail = req.body;
      console.log(userDetail);
      const profileFilePath = await convertBase64.base64ToJpg(
        userDetail.profile_image
      );
      const registrationResult = await authService.register(
        userDetail,
        profileFilePath
      );

      return res.status(201).json({ message: registrationResult.message });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(401).json({ error: "Failed to create user" });
    }
  },

  async registerStudent(req, res) {
    try {
      const studentDetails = req.body;

      const registrationResult = await authService.registerStudent(
        studentDetails
      );

      return res.status(201).json({ message: registrationResult.message });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(401).json({ error });
    }
  },

  // SIGN IN
  async signIn(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await authService.signIn(email, password, role);

      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(401).json({ message: "Sign in failed" });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      return res.status(401).json({ error: "Failed to sign in" });
    }
  },
};
