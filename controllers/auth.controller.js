const authService = require('../services/auth.service');



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
      } = req.body;

      const profile_image = req.file;

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
        profile_image_path = profile_image.path,
        first_name,
        last_name,
      );

      return res.status(201).json({ message: registrationResult.message });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(401).json({ error: 'Failed to create user' });
    }
  },


  // SIGN IN
  async signIn(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await authService.signIn(email, password, role);

      if (user) {
        return res.status(200).json({ message: 'Sign in successfully', user: user });
      }
      else {
        return res.status(401).json({ message: 'Sign in failed' });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      return res.status(401).json({ error: 'Failed to sign in' });
    }
  }
};

