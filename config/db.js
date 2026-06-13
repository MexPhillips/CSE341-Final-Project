const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✓ MongoDB Connected Successfully...');
    console.log(`✓ Connected to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
}

module.exports = connectDB;
