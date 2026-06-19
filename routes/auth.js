const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @openapi
 * /auth/github:
 *   get:
 *     summary: Initiate GitHub OAuth flow
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to GitHub for authentication
 */
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * @openapi
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Returns JWT token after successful authentication
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-env';
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, username: req.user.username },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Store token in cookie and redirect with token in query for display
      res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.redirect(`/?token=${encodeURIComponent(token)}`);
    } catch (err) {
      console.error('GitHub callback error:', err);
      res.redirect('/login?error=Authentication failed');
    }
  }
);

/**
 * @openapi
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to login page
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
