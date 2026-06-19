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
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', auth, asyncHandler(getUsers));
router.post('/', asyncHandler(createUser));
router.get('/:id', auth, asyncHandler(getUserById));
const { validate, Joi } = require('../middleware/validate');
const updateUserSchema = Joi.object({ id: Joi.string().required(), username: Joi.string().min(3).max(30).optional(), email: Joi.string().email().optional() });
/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update a user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.put('/:id', auth, validate(updateUserSchema), asyncHandler(updateUser));
router.delete('/:id', auth, asyncHandler(deleteUser));

module.exports = router;
