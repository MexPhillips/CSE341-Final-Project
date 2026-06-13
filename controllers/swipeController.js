const mongoose = require('mongoose');
const Swipe = require('../models/Swipe');
const Session = require('../models/Session');
const Title = require('../models/Title');

async function submitSwipe(req, res) {
  try {
    const { sessionId, titleId, vote } = req.body || {};
    const userId = req.user && req.user.id;

    if (!sessionId || !titleId || typeof vote !== 'boolean') {
      return res.status(400).json({ error: 'sessionId, titleId and vote(boolean) are required' });
    }
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const swipe = await Swipe.findOneAndUpdate(
      { sessionId, userId, titleId },
      { sessionId, userId, titleId, vote },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (vote === true) {
      const session = await Session.findById(sessionId).select('members');
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const memberCount = session.members.length;
      const rightCount = await Swipe.countDocuments({ sessionId, titleId, vote: true });

      if (memberCount > 0 && rightCount >= memberCount) {
        const title = await Title.findById(titleId).lean();
        return res.json({ match: true, title, session, swipe });
      }
    }

    return res.json({ match: false, swipe });
  } catch (err) {
    console.error('submitSwipe error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getMatches(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).select('members');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const memberCount = session.members.length;
    const matches = await Swipe.aggregate([
      { $match: { sessionId: mongoose.Types.ObjectId(sessionId), vote: true } },
      { $group: { _id: '$titleId', votes: { $sum: 1 } } },
      { $match: { votes: memberCount } },
      {
        $lookup: {
          from: 'titles',
          localField: '_id',
          foreignField: '_id',
          as: 'title',
        },
      },
      { $unwind: '$title' },
      { $project: { title: 1, votes: 1 } },
    ]);

    return res.json({ sessionId, matches });
  } catch (err) {
    console.error('getMatches error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function updateSwipe(req, res) {
  try {
    const { id } = req.params;
    const { vote } = req.body || {};
    const userId = req.user && req.user.id;

    if (typeof vote !== 'boolean') {
      return res.status(400).json({ error: 'vote(boolean) is required' });
    }
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const swipe = await Swipe.findById(id);
    if (!swipe) return res.status(404).json({ error: 'Swipe not found' });
    if (String(swipe.userId) !== String(userId)) {
      return res.status(403).json({ error: 'You can only update your own swipe' });
    }

    swipe.vote = vote;
    await swipe.save();

    if (vote === true) {
      const session = await Session.findById(swipe.sessionId).select('members');
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const memberCount = session.members.length;
      const rightCount = await Swipe.countDocuments({ sessionId: swipe.sessionId, titleId: swipe.titleId, vote: true });

      if (memberCount > 0 && rightCount >= memberCount) {
        const title = await Title.findById(swipe.titleId).lean();
        return res.json({ match: true, title, swipe });
      }
    }

    return res.json({ match: false, swipe });
  } catch (err) {
    console.error('updateSwipe error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteSwipes(req, res) {
  try {
    const { sessionId } = req.params;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (String(session.hostId) !== String(userId)) {
      return res.status(403).json({ error: 'Only the host can clear swipe data' });
    }

    const result = await Swipe.deleteMany({ sessionId });
    return res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error('deleteSwipes error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { submitSwipe, getMatches, updateSwipe, deleteSwipes };
