const authService = require("../services/auth.service");
const mime = require("mime");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
  // REGISTER
  async register(req, res) {
    try {
      const {
        email,
        password,
        role,
        marital_status,
        country,
        profile_image_type,
        organization,
        designation,
        qualification,
        register_date,
        register_id,
        admin_type,
        status,
        employee_id,
        first_name,
        last_name,
        profile_image,
      } = req.body;

      const base64File = profile_image;
      const buffer = Buffer.from(base64File, "base64");
      const fileExtension = mime.extension(profile_image_type);
      const defaultExtension = "txt";

      const fileName = `profile_image${Date.now()}.${
        fileExtension || defaultExtension
      }`;
      const profile_image_path = path.join(__dirname, "../uploads", fileName);

      await fs.writeFile(profile_image_path, buffer);

      const registrationResult = await authService.register(
        email,
        password,
        role,
        marital_status,
        country,
        organization,
        designation,
        qualification,
        register_date,
        register_id,
        admin_type,
        status,
        employee_id,
        profile_image_path,
        first_name,
        last_name
      );

      return res.status(201).json({ message: registrationResult.message });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(401).json({ error: "Failed to create user" });
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
