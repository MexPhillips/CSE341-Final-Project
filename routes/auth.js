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
const asyncHandler = require('../middleware/asyncHandler');
const { validate, Joi } = require('../middleware/validate');
const { register, login, oauthSuccess, oauthFailure, changePassword, deleteAccount } = require('../controllers/authController');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const deleteAccountSchema = Joi.object({
  id: Joi.string().required(),
});

router.post('/register', validate(registerSchema), asyncHandler(register));

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
router.post('/login', asyncHandler(login));

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
 * /auth/{username}:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Missing fields or invalid password
 *       403:
 *         description: Can only change your own password
 *       404:
 *         description: User not found
 */
router.put('/:username', auth, validate(changePasswordSchema), asyncHandler(changePassword));

/**
 * @openapi
 * /auth/{username}:
 *   delete:
 *     summary: Delete user account
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       403:
 *         description: Can only delete your own account
 *       404:
 *         description: User not found
 */
router.delete('/:username', auth, asyncHandler(deleteAccount));

module.exports = router;
