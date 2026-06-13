/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: bingeFan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing input data
 *       409:
 *         description: User already exists
 */
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { register, login, oauthSuccess, oauthFailure } = require('../controllers/authController');

router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

function requireGithubOAuth(req, res, next) {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(503).json({ error: 'GitHub OAuth is not configured' });
  }
  next();
}

/**
 * @openapi
 * /auth/github:
 *   get:
 *     summary: Start GitHub OAuth login flow
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to GitHub login
 */
router.get('/github', requireGithubOAuth, passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @openapi
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback endpoint
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: OAuth login successful and JWT returned
 *       401:
 *         description: OAuth login failed
 */
router.get(
  '/github/callback',
  requireGithubOAuth,
  passport.authenticate('github', { failureRedirect: '/auth/github/failure', session: false }),
  oauthSuccess
);

/**
 * @openapi
 * /auth/github/failure:
 *   get:
 *     summary: GitHub OAuth failure redirect
 *     tags:
 *       - Authentication
 *     responses:
 *       401:
 *         description: OAuth authentication failed
 */
router.get('/github/failure', oauthFailure);

module.exports = router;
