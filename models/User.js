const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, default: null },
    // createdAt will be added automatically by timestamps (defaults to Date.now)
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
