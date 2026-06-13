const Title = require('../models/Title');

async function createTitle(req, res) {
  try {
    const { tmdbId, title, posterPath, overview, type } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const existing = tmdbId ? await Title.findOne({ tmdbId }) : null;
    if (existing) {
      return res.status(409).json({ error: 'Title with this tmdbId already exists' });
    }

    const newTitle = new Title({ tmdbId, title, posterPath, overview, type });
    await newTitle.save();
    return res.status(201).json(newTitle);
  } catch (err) {
    console.error('createTitle error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getPool(req, res) {
  try {
    const titles = await Title.find();
    return res.json(titles);
  } catch (err) {
    console.error('getPool error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function updateTitle(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    if (updates.tmdbId !== undefined) title.tmdbId = updates.tmdbId;
    if (updates.title !== undefined) title.title = updates.title;
    if (updates.posterPath !== undefined) title.posterPath = updates.posterPath;
    if (updates.overview !== undefined) title.overview = updates.overview;
    if (updates.type !== undefined) title.type = updates.type;

    await title.save();
    return res.json(title);
  } catch (err) {
    console.error('updateTitle error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteTitle(req, res) {
  try {
    const { id } = req.params;
    const title = await Title.findById(id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    await title.deleteOne();
    return res.json({ message: 'Title removed' });
  } catch (err) {
    console.error('deleteTitle error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createTitle, getPool, updateTitle, deleteTitle };
