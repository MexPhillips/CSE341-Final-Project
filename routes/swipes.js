/**
 * @openapi
 * /swipes:
 *   post:
 *     summary: Submit a swipe vote for a title in a session
 *     tags:
 *       - Swipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - titleId
 *               - vote
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: 605c4f1b2f1b2a3c4d5e6f70
 *               titleId:
 *                 type: string
 *                 example: 605c4f1b2f1b2a3c4d5e6f71
 *               vote:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Swipe recorded successfully
 *       400:
 *         description: Missing required fields
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitSwipe, getMatches, updateSwipe, deleteSwipes } = require('../controllers/swipeController');

router.post('/', auth, submitSwipe);

/**
 * @openapi
 * /swipes/matches/{sessionId}:
 *   get:
 *     summary: Get current matches for a session
 *     tags:
 *       - Swipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns matches for the session
 *       404:
 *         description: Session not found
 */
router.get('/matches/:sessionId', auth, getMatches);

/**
 * @openapi
 * /swipes/{id}:
 *   get:
 *     summary: Get a swipe by id
 *     tags:
 *       - Swipes
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
 *         description: Returns the swipe record
 *       404:
 *         description: Swipe not found
 */
router.get('/:id', auth, getSwipeById);

/**
 * @openapi
 * /swipes/{id}:
 *   put:
 *     summary: Update an existing swipe vote
 *     tags:
 *       - Swipes
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
 *               - vote
 *             properties:
 *               vote:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Swipe updated successfully
 *       403:
 *         description: Can only update your own swipe
 *       404:
 *         description: Swipe not found
 */
router.put('/:id', auth, updateSwipe);

/**
 * @openapi
 * /swipes/{sessionId}:
 *   delete:
 *     summary: Delete all swipe data for a session
 *     tags:
 *       - Swipes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Swipe data cleared for the session
 *       403:
 *         description: Only host can clear swipe data
 *       404:
 *         description: Session not found
 */
router.delete('/:sessionId', auth, deleteSwipes);

module.exports = router;
