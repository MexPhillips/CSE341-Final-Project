const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    const emailLower = email.toLowerCase();

    const existing = await User.findOne({ $or: [{ email: emailLower }, { username }] });
    if (existing) {
      return res.status(409).json({ error: 'User with that email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ username, email: emailLower, passwordHash });
    await user.save();

    return res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = createJwtToken(user);

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

function createJwtToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment');
    throw new Error('Server configuration error');
  }

  return jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
}

async function oauthSuccess(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: 'OAuth login failed' });
    }

    const token = createJwtToken(user);
    return res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('OAuth success error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function oauthFailure(req, res) {
  return res.status(401).json({ error: 'OAuth authentication failed' });
}

module.exports = { register, login, oauthSuccess, oauthFailure };
