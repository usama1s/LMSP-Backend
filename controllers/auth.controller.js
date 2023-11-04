const authService = require('../services/auth.service');

// SIGN IN
async function signIn(req, res) {
    try {
      const userData = req.body; 
      const user = await authService.signIn(userData);
      return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }
  
module.exports = { signIn };
