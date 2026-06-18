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
