/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: Create a new session and room code
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Session created successfully
 *       401:
 *         description: Unauthorized
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { validate, Joi } = require('../middleware/validate');
const { createSession, joinSession, getSession, updateSession, deleteSession } = require('../controllers/sessionController');

const joinSchema = Joi.object({ roomCode: Joi.string().required() });
const updateSessionSchema = Joi.object({ id: Joi.string().required(), status: Joi.string().valid('active','closed').required() });

router.post('/', auth, asyncHandler(createSession));
router.post('/join', auth, validate(joinSchema), asyncHandler(joinSession));
router.put('/:id', auth, validate(updateSessionSchema), asyncHandler(updateSession));

/**
 * @openapi
 * /sessions/join:
 *   post:
 *     summary: Join an active session by room code
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomCode
 *             properties:
 *               roomCode:
 *                 type: string
 *                 example: ABC123
 *     responses:
 *       200:
 *         description: Session joined successfully
 *       400:
 *         description: Missing room code
 *       404:
 *         description: Active session not found
 */
router.post('/join', auth, asyncHandler(joinSession));

/**
 * @openapi
 * /sessions/{id}:
 *   get:
 *     summary: Get session details by id
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns session details
 *       404:
 *         description: Session not found
 */
router.get('/:id', auth, asyncHandler(getSession));

/**
 * @openapi
 * /sessions/{id}:
 *   put:
 *     summary: Update session status
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, closed]
 *                 example: closed
 *     responses:
 *       200:
 *         description: Session status updated
 *       403:
 *         description: Only host can update session
 *       404:
 *         description: Session not found
 */
router.put('/:id', auth, asyncHandler(updateSession));

/**
 * @openapi
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session as the host
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 *       403:
 *         description: Only host can delete the session
 *       404:
 *         description: Session not found
 */
router.delete('/:id', auth, asyncHandler(deleteSession));

module.exports = router;
