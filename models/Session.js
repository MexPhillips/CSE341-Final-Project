const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const sessionSchema = new Schema(
  {
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomCode: { type: String, required: true, unique: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = model('Session', sessionSchema);
