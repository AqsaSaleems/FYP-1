import express from 'express';
import Admin from '../models/Admin.js';
const router = express.Router();

// Example: admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if(admin) res.json({ message: 'Login successful' });
  else res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
