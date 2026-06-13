const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function configurePassport() {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL =
    process.env.GITHUB_CALLBACK_URL ||
    `${process.env.API_BASE_URL || 'http://localhost:3000'}/auth/github/callback`;

  if (!clientID || !clientSecret) {
    console.warn('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable it.');
    return false;
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error('GitHub account does not provide an email'), null);
          }

          let user = await User.findOne({ email });
          if (!user) {
            const username = (profile.username || profile.displayName || `githubuser_${Date.now()}`)
              .replace(/\s+/g, '')
              .toLowerCase()
              .slice(0, 24);

            user = await User.create({
              username,
              email,
              passwordHash: '',
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  return true;
};
