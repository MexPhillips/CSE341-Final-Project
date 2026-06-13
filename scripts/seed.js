require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Title = require('../models/Title');
const Session = require('../models/Session');
const Swipe = require('../models/Swipe');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Swipe.deleteMany({}),
    Session.deleteMany({}),
    Title.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log('Creating users...');
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const users = await User.create([
    {
      username: 'hostuser',
      email: 'host@example.com',
      passwordHash,
    },
    {
      username: 'guestuser',
      email: 'guest@example.com',
      passwordHash,
    },
  ]);

  console.log('Creating titles...');
  const titles = await Title.create([
    {
      tmdbId: 100,
      title: 'Midnight Escape',
      posterPath: 'https://via.placeholder.com/300x450?text=Midnight+Escape',
      overview: 'A group of friends race against time to solve a city-wide mystery after dark.',
      type: 'movie',
    },
    {
      tmdbId: 101,
      title: 'Galaxy Games',
      posterPath: 'https://via.placeholder.com/300x450?text=Galaxy+Games',
      overview: 'An interstellar reality competition where every challenge could mean the end of the line.',
      type: 'movie',
    },
    {
      tmdbId: 102,
      title: 'Seven Hearts',
      posterPath: 'https://via.placeholder.com/300x450?text=Seven+Hearts',
      overview: 'A romantic drama about seven strangers whose lives become intertwined in one summer.',
      type: 'movie',
    },
    {
      tmdbId: 103,
      title: 'Quantum Rift',
      posterPath: 'https://via.placeholder.com/300x450?text=Quantum+Rift',
      overview: 'A sci-fi thriller where alternate realities collide during an experiment gone wrong.',
      type: 'movie',
    },
    {
      tmdbId: 104,
      title: 'Hidden Trails',
      posterPath: 'https://via.placeholder.com/300x450?text=Hidden+Trails',
      overview: 'A wilderness adventure series following explorers searching for a lost civilization.',
      type: 'tv',
    },
  ]);

  console.log('Creating a session...');
  const session = await Session.create({
    hostId: users[0]._id,
    roomCode: 'BINGEM',
    members: [users[0]._id, users[1]._id],
    status: 'active',
  });

  console.log('Creating swipes...');
  await Swipe.create([
    {
      sessionId: session._id,
      userId: users[0]._id,
      titleId: titles[0]._id,
      vote: true,
    },
    {
      sessionId: session._id,
      userId: users[1]._id,
      titleId: titles[0]._id,
      vote: true,
    },
    {
      sessionId: session._id,
      userId: users[0]._id,
      titleId: titles[1]._id,
      vote: false,
    },
    {
      sessionId: session._id,
      userId: users[1]._id,
      titleId: titles[1]._id,
      vote: true,
    },
    {
      sessionId: session._id,
      userId: users[0]._id,
      titleId: titles[2]._id,
      vote: true,
    },
    {
      sessionId: session._id,
      userId: users[1]._id,
      titleId: titles[2]._id,
      vote: false,
    },
  ]);

  console.log('Sample data seeded successfully!');
  console.log('Use the following seeded credentials for auth endpoints:');
  console.log('  Email: host@example.com  Password: Password123!');
  console.log('  Email: guest@example.com Password: Password123!');
  console.log('Sample session roomCode:', session.roomCode);
  console.log('Seeded', {
    users: users.length,
    titles: titles.length,
    session: session.roomCode,
  });

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding error:', error);
  process.exit(1);
});
