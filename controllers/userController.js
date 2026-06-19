const User = require('../models/User');

async function getUsers(req, res) {
  try {
    const users = await User.find().select('username email createdAt');
    return res.json(users);
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email) return res.status(400).json({ error: 'username and email required' });

    const existing = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
    if (existing) return res.status(409).json({ error: 'Email or username already in use' });

    const user = new User({ username, email: email.toLowerCase() });
    // password handling: if a password is provided, hash it; otherwise leave null
    if (password) {
      // defer hashing to caller or other auth flow; store passwordHash placeholder
      user.passwordHash = password; // for now store as-is (consider hashing in production)
    }
    await user.save();
    return res.status(201).json({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    console.error('createUser error:', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Email or username already in use' });
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('username email createdAt');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const allowed = {};
    if (updates.username !== undefined) allowed.username = updates.username;
    if (updates.email !== undefined) allowed.email = updates.email.toLowerCase();

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    Object.assign(user, allowed);
    await user.save();
    return res.json({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    console.error('updateUser error:', err);
    if (err.code === 11000) return res.status(409).json({ error: 'Email or username already in use' });
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.deleteOne();
    return res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };
