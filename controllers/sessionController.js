const Session = require('../models/Session');

function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createSession(req, res) {
  try {
    const hostId = req.user && req.user.id;
    if (!hostId) return res.status(401).json({ error: 'Unauthorized' });

    let roomCode;
    const maxAttempts = 10;
    let attempts = 0;
    while (!roomCode && attempts < maxAttempts) {
      attempts += 1;
      const candidate = generateRoomCode(6);
      const exists = await Session.findOne({ roomCode: candidate });
      if (!exists) roomCode = candidate;
    }

    if (!roomCode) {
      return res.status(500).json({ error: 'Could not generate unique room code' });
    }

    const session = new Session({ hostId, roomCode, members: [hostId] });
    await session.save();

    return res.status(201).json(session);
  } catch (err) {
    console.error('createSession error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function joinSession(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { roomCode } = req.body || {};
    if (!roomCode) return res.status(400).json({ error: 'roomCode is required' });

    const session = await Session.findOne({ roomCode, status: 'active' });
    if (!session) return res.status(404).json({ error: 'Active session not found' });

    const alreadyMember = session.members.some((m) => String(m) === String(userId));
    if (!alreadyMember) {
      session.members.push(userId);
      await session.save();
    }

    return res.json(session);
  } catch (err) {
    console.error('joinSession error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getSession(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    return res.json(session);
  } catch (err) {
    console.error('getSession error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function updateSession(req, res) {
  try {
    const hostId = req.user && req.user.id;
    const { id } = req.params;
    const { status } = req.body || {};
    if (!['active', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'status must be either active or closed' });
    }

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (String(session.hostId) !== String(hostId)) {
      return res.status(403).json({ error: 'Only the host can update the session' });
    }

    session.status = status;
    await session.save();
    return res.json(session);
  } catch (err) {
    console.error('updateSession error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteSession(req, res) {
  try {
    const hostId = req.user && req.user.id;
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (String(session.hostId) !== String(hostId)) {
      return res.status(403).json({ error: 'Only the host can delete the session' });
    }

    await session.deleteOne();
    return res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error('deleteSession error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createSession, joinSession, getSession, updateSession, deleteSession };
