const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const swipeSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    titleId: { type: Schema.Types.ObjectId, ref: 'Title', required: true },
    vote: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// Ensure a user can vote only once per title within a session
swipeSchema.index({ sessionId: 1, userId: 1, titleId: 1 }, { unique: true });

module.exports = model('Swipe', swipeSchema);
