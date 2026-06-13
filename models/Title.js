const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const titleSchema = new Schema(
  {
    tmdbId: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    posterPath: { type: String },
    overview: { type: String },
    type: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  }
);

module.exports = model('Title', titleSchema);
