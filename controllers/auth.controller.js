const authService = require('../services/auth.service');



module.exports = {
  // REGISTER
  async register(req, res) {
    try {
      const { email, password, role, marital_status, country, organization, designation, qualification, register_date } = req.body;
      const registrationResult = await authService.register( email, password, role, marital_status, country, organization, designation, qualification, register_date);
      if ('message' in registrationResult && registrationResult.message === 'User is already registered') {
        return res.status(409).json({ error: 'User is already registered' });
      } else {
        return res.status(201).json({ message: 'User created successfully', user: registrationResult.user });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  },

  // SIGN IN
  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const signInResult = await authService.signIn(email, password);
      if ('message' in signInResult && signInResult.message === 'Sign in successfully') {
        return res.status(200).json({ message: 'Sign in successfully', user: signInResult.user });
      } else {
        return res.status(401).json({ message: 'Sign in failed' });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      return res.status(500).json({ error: 'Failed to sign in' });
    }
  }
};

