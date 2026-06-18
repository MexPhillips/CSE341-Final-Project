/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', auth, asyncHandler(getUsers));
router.get('/:id', auth, asyncHandler(getUserById));
const { validate, Joi } = require('../middleware/validate');
const updateUserSchema = Joi.object({ id: Joi.string().required(), username: Joi.string().min(3).max(30).optional(), email: Joi.string().email().optional() });
router.put('/:id', auth, validate(updateUserSchema), asyncHandler(updateUser));
router.delete('/:id', auth, asyncHandler(deleteUser));

module.exports = router;
